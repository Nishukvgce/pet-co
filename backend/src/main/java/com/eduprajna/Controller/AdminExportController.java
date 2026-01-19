package com.eduprajna.Controller;

import java.io.BufferedWriter;
import java.io.OutputStreamWriter;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import com.eduprajna.config.CorsConfig;
import com.eduprajna.entity.Order;
import com.eduprajna.entity.User;
import com.eduprajna.repository.OrderRepository;
import com.eduprajna.repository.UserRepository;

/**
 * Simple admin export controller to stream CSV exports for Orders and Users.
 * Accepts `period` param: daily, weekly, monthly, yearly, all
 * Optional `year` and `month` for monthly/yearly selection.
 */
@Controller
@RequestMapping("/api/admin/export")
@CrossOrigin(origins = {CorsConfig.LOCALHOST_3000, CorsConfig.LOCALHOST_IP_3000, CorsConfig.VERCEL_NEW}, allowCredentials = "true")
public class AdminExportController {
    private static final Logger log = LoggerFactory.getLogger(AdminExportController.class);

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public AdminExportController(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    private static OffsetDateTime[] computeRange(String period, Integer year, Integer month) {
        final OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        switch ((period == null) ? "all" : period.toLowerCase()) {
            case "daily": {
                OffsetDateTime start = now.withHour(0).withMinute(0).withSecond(0).withNano(0);
                OffsetDateTime end = start.plusDays(1).minusNanos(1);
                return new OffsetDateTime[]{start, end};
            }
            case "weekly": {
                // week starting Monday
                LocalDate today = now.toLocalDate();
                LocalDate monday = today.minusDays((today.getDayOfWeek().getValue() + 6) % 7);
                OffsetDateTime start = monday.atStartOfDay().atOffset(ZoneOffset.UTC);
                OffsetDateTime end = start.plusDays(7).minusNanos(1);
                return new OffsetDateTime[]{start, end};
            }
            case "monthly": {
                YearMonth ym;
                if (year != null && month != null) {
                    ym = YearMonth.of(year, month);
                } else {
                    ym = YearMonth.from(now);
                }
                OffsetDateTime start = ym.atDay(1).atStartOfDay().atOffset(ZoneOffset.UTC);
                OffsetDateTime end = ym.atEndOfMonth().atStartOfDay().atOffset(ZoneOffset.UTC).plusDays(1).minusNanos(1);
                return new OffsetDateTime[]{start, end};
            }
            case "yearly": {
                int y = (year != null) ? year : now.getYear();
                OffsetDateTime start = LocalDate.of(y, 1, 1).atStartOfDay().atOffset(ZoneOffset.UTC);
                OffsetDateTime end = LocalDate.of(y, 12, 31).atStartOfDay().atOffset(ZoneOffset.UTC).plusDays(1).minusNanos(1);
                return new OffsetDateTime[]{start, end};
            }
            case "all":
            default:
                return null;
        }
    }

    private static String csvEscape(String s) {
        if (s == null) return "";
        String out = s.replace("\"", "\"\"");
        if (out.contains(",") || out.contains("\n") || out.contains("\"")) {
            return "\"" + out + "\"";
        }
        return out;
    }

    @GetMapping(path = "/orders", produces = "text/csv")
    @ResponseBody
    public ResponseEntity<StreamingResponseBody> exportOrders(
            @RequestParam(value = "period", required = false) String period,
            @RequestParam(value = "year", required = false) Integer year,
            @RequestParam(value = "month", required = false) Integer month
    ) {
        try {
            OffsetDateTime[] range = computeRange(period, year, month);

            List<Order> orders;
            if (range == null) {
                orders = orderRepository.findAll();
            } else {
                orders = orderRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(range[0], range[1]);
            }

            String filename = "orders" + ((period == null) ? "_all" : "_" + period) + ".csv";

            StreamingResponseBody stream = out -> {
                try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(out))) {
                    // header
                    writer.write("order_id,created_at,status,total,user_email,user_name,items_count\n");
                    for (Order o : orders) {
                        String userEmail = (o.getUser() != null) ? o.getUser().getEmail() : "";
                        String userName = (o.getUser() != null) ? o.getUser().getName() : "";
                        int itemsCount = (o.getItems() != null) ? o.getItems().size() : 0;
                        String line = String.join(",",
                                csvEscape(String.valueOf(o.getId())),
                                csvEscape(o.getCreatedAt() != null ? o.getCreatedAt().toString() : ""),
                                csvEscape(o.getStatus()),
                                csvEscape(String.valueOf(o.getTotal())),
                                csvEscape(userEmail),
                                csvEscape(userName),
                                csvEscape(String.valueOf(itemsCount))
                        );
                        writer.write(line + "\n");
                    }
                }
            };

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.parseMediaType("text/csv"))
                    .body(stream);
        } catch (Exception e) {
            log.error("Error exporting orders CSV", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping(path = "/customers", produces = "text/csv")
    @ResponseBody
    public ResponseEntity<StreamingResponseBody> exportCustomers(
            @RequestParam(value = "period", required = false) String period,
            @RequestParam(value = "year", required = false) Integer year,
            @RequestParam(value = "month", required = false) Integer month
    ) {
        try {
            OffsetDateTime[] range = computeRange(period, year, month);

            List<User> users;
            if (range == null) {
                users = userRepository.findAll();
            } else {
                users = userRepository.findByCreatedAtBetween(range[0], range[1]);
            }

            String filename = "customers" + ((period == null) ? "_all" : "_" + period) + ".csv";

            StreamingResponseBody stream = out -> {
                try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(out))) {
                    writer.write("user_id,name,email,phone,created_at,total_orders,loyalty_points,is_active,member_since\n");
                    for (User u : users) {
                        String line = String.join(",",
                                csvEscape(String.valueOf(u.getId())),
                                csvEscape(u.getName()),
                                csvEscape(u.getEmail()),
                                csvEscape(u.getPhone()),
                                csvEscape(u.getCreatedAt() != null ? u.getCreatedAt().toString() : ""),
                                csvEscape(String.valueOf(u.getTotalOrders())),
                                csvEscape(String.valueOf(u.getLoyaltyPoints())),
                                csvEscape(String.valueOf(u.getIsActive())),
                                csvEscape(u.getMemberSince() != null ? u.getMemberSince().toString() : "")
                        );
                        writer.write(line + "\n");
                    }
                }
            };

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.parseMediaType("text/csv"))
                    .body(stream);
        } catch (Exception e) {
            log.error("Error exporting customers CSV", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
