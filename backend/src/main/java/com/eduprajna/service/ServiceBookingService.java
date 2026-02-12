package com.eduprajna.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eduprajna.dto.ServiceBookingDTO;
import com.eduprajna.entity.ServiceBooking;
import com.eduprajna.entity.User;
import com.eduprajna.repository.ServiceBookingRepository;
import com.eduprajna.repository.UserRepository;

@Service
@Transactional
public class ServiceBookingService {

    private static final Logger logger = LoggerFactory.getLogger(ServiceBookingService.class);

    @Autowired
    private ServiceBookingRepository serviceBookingRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FileUploadService fileUploadService;

    @Autowired(required = false)
    private S3ImageService s3ImageService;

    // Create a new service booking
    public ServiceBookingDTO createBooking(ServiceBookingDTO bookingDTO) {
        try {
            System.out.println("[DEBUG] Creating booking with DTO: " + (bookingDTO.getPetName() != null ? bookingDTO.getPetName() : "null") + ", " + (bookingDTO.getServiceName() != null ? bookingDTO.getServiceName() : "null"));
            System.out.println("[DEBUG] Service Type: " + bookingDTO.getServiceType());
            System.out.println("[DEBUG] Owner Name: " + bookingDTO.getOwnerName());
            System.out.println("[DEBUG] Phone: " + bookingDTO.getPhone());
            System.out.println("[DEBUG] Address: " + bookingDTO.getAddress());
            
            // Validate required fields
            if (bookingDTO.getPetName() == null || bookingDTO.getPetName().trim().isEmpty()) {
                throw new IllegalArgumentException("Pet name is required");
            }
            if (bookingDTO.getOwnerName() == null || bookingDTO.getOwnerName().trim().isEmpty()) {
                throw new IllegalArgumentException("Owner name is required");
            }
            if (bookingDTO.getPhone() == null || bookingDTO.getPhone().trim().isEmpty()) {
                throw new IllegalArgumentException("Phone number is required");
            }
            if (bookingDTO.getServiceName() == null || bookingDTO.getServiceName().trim().isEmpty()) {
                throw new IllegalArgumentException("Service name is required");
            }
            
            ServiceBooking booking = convertToEntity(bookingDTO);
            System.out.println("[DEBUG] Converted to entity: " + (booking.getPetName() != null ? booking.getPetName() : "null") + ", " + (booking.getServiceName() != null ? booking.getServiceName() : "null"));
            System.out.println("[DEBUG] Entity Service Type: " + booking.getServiceType());
            System.out.println("[DEBUG] Entity Address: " + booking.getAddress());
            
            // Validate entity before saving
            if (booking.getAddress() == null || booking.getAddress().trim().isEmpty()) {
                throw new IllegalArgumentException("Address is required for database constraint");
            }
            if (booking.getPetType() == null || booking.getPetType().trim().isEmpty()) {
                throw new IllegalArgumentException("Pet type is required for database constraint");
            }
            if (booking.getServiceType() == null || booking.getServiceType().trim().isEmpty()) {
                throw new IllegalArgumentException("Service type is required for database constraint");
            }
            if (booking.getPreferredTime() == null || booking.getPreferredTime().trim().isEmpty()) {
                throw new IllegalArgumentException("Preferred time is required for database constraint");
            }
            
            System.out.println("[DEBUG] All validations passed, saving to database...");
            ServiceBooking savedBooking = serviceBookingRepository.save(booking);
            System.out.println("[DEBUG] Saved booking with ID: " + savedBooking.getId());
            
            // Log saved booking details for verification
            System.out.println("[DEBUG] Saved booking details:");
            System.out.println("  - ID: " + savedBooking.getId());
            System.out.println("  - Pet Name: " + savedBooking.getPetName());
            System.out.println("  - Owner Name: " + savedBooking.getOwnerName());
            System.out.println("  - Service: " + savedBooking.getServiceName());
            System.out.println("  - Service Type: " + savedBooking.getServiceType());
            System.out.println("  - Status: " + savedBooking.getStatus());
            System.out.println("  - Total Amount: " + savedBooking.getTotalAmount());
            
            ServiceBookingDTO result = convertToDTO(savedBooking);
            
            // Critical debugging for email functionality
            System.out.println("\n=== EMAIL FUNCTIONALITY DEBUG ===");
            System.out.println("🔍 Email in DTO: " + result.getEmail());
            System.out.println("🔍 Email Service Bean: " + (emailService != null ? "INJECTED" : "NULL"));
            System.out.println("🔍 Pet Name: " + result.getPetName());
            System.out.println("🔍 Owner Name: " + result.getOwnerName());
            System.out.println("🔍 Service Type: " + result.getServiceType());
            
            // Send confirmation email for new booking
            if (result.getEmail() != null && !result.getEmail().trim().isEmpty()) {
                try {
                    System.out.println("📧 ATTEMPTING to send booking confirmation email...");
                    System.out.println("📮 Email Address: " + result.getEmail());
                    System.out.println("🎯 Booking ID: " + result.getId());
                    
                    emailService.sendServiceBookingConfirmation(result);
                    System.out.println("✅ Booking confirmation email sent successfully!");
                    System.out.println("🎉 Customer should receive confirmation email at: " + result.getEmail());
                } catch (Exception e) {
                    System.err.println("❌ Failed to send booking confirmation email: " + e.getMessage());
                    System.err.println("🔧 Email Service Error Details: " + e.getClass().getSimpleName());
                    e.printStackTrace();
                    logger.error("Failed to send booking confirmation email for booking {}: {}", savedBooking.getId(), e.getMessage(), e);
                    // Don't fail the booking creation if email fails
                }
            } else {
                System.out.println("⚠️  No email address provided - skipping confirmation email");
                System.out.println("🔍 DTO Email field: '" + result.getEmail() + "'");
                System.out.println("🔍 Original Booking Email: '" + savedBooking.getEmail() + "'");
            }
            System.out.println("=== END EMAIL DEBUG ===\n");
            
            System.out.println("[DEBUG] Returning DTO with ID: " + result.getId());
            return result;
        } catch (Exception e) {
            System.err.println("[ERROR] Failed to save booking: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to save booking: " + e.getMessage(), e);
        }
    }

    // Get all service bookings
    public List<ServiceBookingDTO> getAllBookings() {
        return serviceBookingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .filter(dto -> dto != null) // Filter out null DTOs
                .collect(Collectors.toList());
    }

    // Get booking by ID
    public Optional<ServiceBookingDTO> getBookingById(Long id) {
        return serviceBookingRepository.findById(id)
                .map(this::convertToDTO);
    }

    // Update booking status
    public Optional<ServiceBookingDTO> updateBookingStatus(Long id, String status, String notes) {
        System.out.println("\n=== SERVICE BOOKING - STATUS UPDATE ===");
        System.out.println("🔄 Processing service booking status update...");
        System.out.println("🎯 Booking ID: #" + id);
        System.out.println("📋 New Status: " + status);
        
        return serviceBookingRepository.findById(id)
                .map(booking -> {
                    String previousStatus = booking.getStatus();
                    System.out.println("📊 Previous Status: " + (previousStatus != null ? previousStatus : "null"));
                    System.out.println("🐾 Service Type: " + booking.getServiceType());
                    System.out.println("🏷️ Service Name: " + booking.getServiceName());
                    System.out.println("🐶 Pet Name: " + booking.getPetName());
                    
                    booking.setStatus(status);
                    if (notes != null) {
                        booking.setNotes(notes);
                        System.out.println("📝 Added Notes: " + notes);
                    }
                    ServiceBooking savedBooking = serviceBookingRepository.save(booking);
                    ServiceBookingDTO dto = convertToDTO(savedBooking);
                    
                    System.out.println("✅ Database updated successfully");
                    
                    // Send email notification for status changes
                    if (!status.equals(previousStatus)) {
                        System.out.println("📧 Triggering email notification...");
                        System.out.println("🔍 Email Service Available: " + (emailService != null));
                        
                        try {
                            // Get email from user account if user is linked
                            String emailAddress = null;
                            if (savedBooking.getUser() != null && 
                                savedBooking.getUser().getEmail() != null && 
                                !savedBooking.getUser().getEmail().trim().isEmpty()) {
                                emailAddress = savedBooking.getUser().getEmail();
                                System.out.println("📮 Using user account email: " + emailAddress);
                            } else if (dto.getEmail() != null && !dto.getEmail().trim().isEmpty()) {
                                emailAddress = dto.getEmail(); // Fallback to booking email
                                System.out.println("📮 Using booking email: " + emailAddress);
                            } else {
                                System.out.println("🔍 User email: " + (savedBooking.getUser() != null ? savedBooking.getUser().getEmail() : "No user"));
                                System.out.println("🔍 DTO email: " + dto.getEmail());
                            }
                            
                            if (emailAddress != null) {
                                // Temporarily set email in DTO for email template
                                dto.setEmail(emailAddress);
                                
                                System.out.println("🎯 Email Address Found: " + emailAddress);
                                System.out.println("📧 Ready to send email for status change: " + previousStatus + " → " + status);
                                
                                // Send specific email based on status
                                if ("CONFIRMED".equals(status)) {
                                    // Use existing confirmation email template
                                    System.out.println("📬 Sending service confirmation email...");
                                    emailService.sendServiceBookingConfirmation(dto);
                                } else {
                                    // Use new status update email template
                                    System.out.println("📬 Sending service status update email...");
                                    emailService.sendServiceStatusUpdate(dto, previousStatus, status);
                                }
                                System.out.println("✅ EMAIL NOTIFICATION COMPLETED SUCCESSFULLY");
                                System.out.println("👤 Customer will receive email about " + booking.getServiceType() + " service status change");
                            } else {
                                System.out.println("⚠️  WARNING: No email address found for booking. Customer will not receive notification.");
                                System.out.println("🔍 Debugging email sources:");
                                System.out.println("   - User exists: " + (savedBooking.getUser() != null));
                                if (savedBooking.getUser() != null) {
                                    System.out.println("   - User email: '" + savedBooking.getUser().getEmail() + "'");
                                }
                                System.out.println("   - DTO email: '" + dto.getEmail() + "'");
                            }
                        } catch (Exception e) {
                            // Log error but don't fail the status update
                            logger.error("Failed to send email notification for booking {} status change from '{}' to '{}': {}", id, previousStatus, status, e.getMessage(), e);
                            System.err.println("❌ EMAIL NOTIFICATION FAILED");
                            System.err.println("💡 Error: " + e.getMessage());
                            System.err.println("🔧 Error Type: " + e.getClass().getSimpleName());
                            e.printStackTrace();
                            System.err.println("⚠️  Customer will NOT receive email notification");
                        }
                    } else {
                        System.out.println("ℹ️  Status unchanged - no email notification needed");
                    }
                    
                    System.out.println("=== SERVICE BOOKING COMPLETE ===\n");
                    return dto;
                });
    }

    // Get bookings by status
    public List<ServiceBookingDTO> getBookingsByStatus(String status) {
        return serviceBookingRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get upcoming bookings
    public List<ServiceBookingDTO> getUpcomingBookings() {
        return serviceBookingRepository.findUpcomingBookings(LocalDate.now())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get bookings by date
    public List<ServiceBookingDTO> getBookingsByDate(LocalDate date) {
        return serviceBookingRepository.findByPreferredDateOrderByPreferredTimeAsc(date)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get bookings for a user via any identifier
    public List<ServiceBookingDTO> getBookingsForUser(Long userId, String email, String phone) {
        System.out.println("[DEBUG] ServiceBookingService.getBookingsForUser - Start");
        System.out.println("[DEBUG] - userId: " + userId);
        System.out.println("[DEBUG] - email: " + email);
        System.out.println("[DEBUG] - phone: " + phone);
        
        List<ServiceBooking> results = new ArrayList<>();
        
        // Prioritize userId search for authenticated users
        if (userId != null) {
            System.out.println("[DEBUG] - Searching by userId (authenticated user)");
            List<ServiceBooking> userIdResults = serviceBookingRepository.findByUser_IdOrderByCreatedAtDesc(userId);
            System.out.println("[DEBUG] - Found " + userIdResults.size() + " bookings by userId");
            results.addAll(userIdResults);
        } else {
            // Fallback to email/phone search only when userId is not available
            System.out.println("[DEBUG] - No userId provided, using email/phone fallback search");
            Set<ServiceBooking> fallbackResults = new HashSet<>();
            
            if (email != null && !email.trim().isEmpty()) {
                List<ServiceBooking> emailResults = serviceBookingRepository.findByEmailIgnoreCaseOrderByCreatedAtDesc(email.trim());
                System.out.println("[DEBUG] - Found " + emailResults.size() + " bookings by email");
                fallbackResults.addAll(emailResults);
            }
            
            if (phone != null && !phone.trim().isEmpty()) {
                List<ServiceBooking> phoneResults = serviceBookingRepository.findByPhoneOrderByCreatedAtDesc(phone.trim());
                System.out.println("[DEBUG] - Found " + phoneResults.size() + " bookings by phone");
                fallbackResults.addAll(phoneResults);
            }
            
            results.addAll(fallbackResults);
        }
        
        // Sort by creation date (newest first)
        results.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
                
        System.out.println("[DEBUG] - Total bookings found: " + results.size());
        
        // Convert to DTOs
        List<ServiceBookingDTO> dtoResults = results.stream()
                .map(this::convertToDTO)
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
                
        System.out.println("[DEBUG] - Converted to " + dtoResults.size() + " DTOs");
        System.out.println("[DEBUG] ServiceBookingService.getBookingsForUser - End");
        
        return dtoResults;
    }

    // Get bookings for a user filtered by service type keyword (walking/boarding/grooming)
    public List<ServiceBookingDTO> getBookingsForUserByType(Long userId, String email, String phone, String typeKeyword) {
        String kw = typeKeyword == null ? "" : typeKeyword.trim();
        List<ServiceBooking> base;
        if (userId != null) base = serviceBookingRepository.findByUser_IdOrderByCreatedAtDesc(userId);
        else if (email != null && !email.trim().isEmpty()) base = serviceBookingRepository.findByEmailIgnoreCaseOrderByCreatedAtDesc(email.trim());
        else if (phone != null && !phone.trim().isEmpty()) base = serviceBookingRepository.findByPhoneOrderByCreatedAtDesc(phone.trim());
        else base = serviceBookingRepository.findAllByOrderByCreatedAtDesc();

        String lkw = kw.toLowerCase();
        return base.stream()
                .filter(b -> (b.getServiceType() + " " + b.getServiceName()).toLowerCase().contains(lkw))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Search bookings
    public List<ServiceBookingDTO> searchBookings(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllBookings();
        }
        return serviceBookingRepository.searchBookings(searchTerm.trim())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get booking statistics
    public BookingStats getBookingStats() {
        Long pending = serviceBookingRepository.countByStatus("PENDING");
        Long confirmed = serviceBookingRepository.countByStatus("CONFIRMED");
        Long inProgress = serviceBookingRepository.countByStatus("IN_PROGRESS");
        Long completed = serviceBookingRepository.countByStatus("COMPLETED");
        Long cancelled = serviceBookingRepository.countByStatus("CANCELLED");

        return new BookingStats(pending, confirmed, inProgress, completed, cancelled);
    }

    // Delete booking
    public boolean deleteBooking(Long id) {
        if (serviceBookingRepository.existsById(id)) {
            serviceBookingRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Convert Entity to DTO
    private ServiceBookingDTO convertToDTO(ServiceBooking booking) {
        if (booking == null) {
            System.err.println("[WARNING] Attempting to convert null ServiceBooking to DTO");
            return null;
        }
        
        ServiceBookingDTO dto = new ServiceBookingDTO();
        dto.setId(booking.getId());
        dto.setPetName(booking.getPetName() != null ? booking.getPetName() : "Unknown Pet");
        dto.setPetType(booking.getPetType() != null ? booking.getPetType() : "Unknown");
        dto.setPetBreed(booking.getPetBreed());
        dto.setPetAge(booking.getPetAge());
        dto.setPetGender(booking.getPetGender());
        dto.setPetDateOfBirth(booking.getPetDateOfBirth());
        
        // Pet photo information
        dto.setPetPhotoPath(booking.getPetPhotoPath());
        dto.setPetPhotoOriginalName(booking.getPetPhotoOriginalName());
        dto.setPetPhotoContentType(booking.getPetPhotoContentType());
        
        dto.setUserId(booking.getUser() != null ? booking.getUser().getId() : null);
        dto.setOwnerName(booking.getOwnerName() != null ? booking.getOwnerName() : "Unknown Owner");
        dto.setPhone(booking.getPhone() != null ? booking.getPhone() : "Unknown");
        dto.setEmail(booking.getEmail());
        dto.setAddress(booking.getAddress() != null ? booking.getAddress() : "Address not provided");
        
        // Detailed address components
        dto.setAddressType(booking.getAddressType());
        dto.setArea(booking.getArea());
        dto.setCityStateCountry(booking.getCityStateCountry());
        dto.setHouseNumber(booking.getHouseNumber());
        dto.setBuilding(booking.getBuilding());
        dto.setFloor(booking.getFloor());
        dto.setLandmark(booking.getLandmark());
        dto.setRecipientName(booking.getRecipientName());
        dto.setRecipientContactNumber(booking.getRecipientContactNumber());
        
        // GPS coordinates
        dto.setGpsLatitude(booking.getGpsLatitude());
        dto.setGpsLongitude(booking.getGpsLongitude());
        
        dto.setServiceName(booking.getServiceName() != null ? booking.getServiceName() : "Unknown Service");
        dto.setServiceType(booking.getServiceType() != null ? booking.getServiceType() : "Unknown");
        dto.setBasePrice(booking.getBasePrice() != null ? booking.getBasePrice() : 0.0);
        dto.setAddOns(booking.getAddOns());
        dto.setTotalAmount(booking.getTotalAmount() != null ? booking.getTotalAmount() : 0.0);
        dto.setPreferredDate(booking.getPreferredDate());
        dto.setPreferredTime(booking.getPreferredTime() != null ? booking.getPreferredTime() : "Not specified");
        dto.setSpecialInstructions(booking.getSpecialInstructions());
        dto.setStatus(booking.getStatus() != null ? booking.getStatus() : "PENDING");
        dto.setNotes(booking.getNotes());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setUpdatedAt(booking.getUpdatedAt());
        
        // Map service-specific fields
        dto.setSymptoms(booking.getSymptoms());
        dto.setMedicalHistory(booking.getMedicalHistory());
        dto.setCurrentMedications(booking.getCurrentMedications());
        dto.setUrgency(booking.getUrgency());
        dto.setPreferredPlatform(booking.getPreferredPlatform());
        dto.setHomeAddress(booking.getHomeAddress());
        dto.setAccessInstructions(booking.getAccessInstructions());
        dto.setWalkDuration(booking.getWalkDuration());
        dto.setRoutePreference(booking.getRoutePreference());
        dto.setBehaviorNotes(booking.getBehaviorNotes());
        dto.setWalkingRules(booking.getWalkingRules());
        dto.setCheckInDate(booking.getCheckInDate());
        dto.setCheckOutDate(booking.getCheckOutDate());
        dto.setCheckInTime(booking.getCheckInTime());
        dto.setCheckOutTime(booking.getCheckOutTime());
        dto.setDietaryRequirements(booking.getDietaryRequirements());
        dto.setEmergencyContact(booking.getEmergencyContact());
        dto.setVaccinationUpToDate(booking.getVaccinationUpToDate());
        dto.setPackageType(booking.getPackageType());
        dto.setSelectedAddOns(booking.getSelectedAddOns());
        dto.setGroomingPreferences(booking.getGroomingPreferences());
        dto.setTemperament(booking.getTemperament());
        
        return dto;
    }

    // Extract service-specific fields from addOns for backward compatibility
    @SuppressWarnings("unchecked")
    private void extractServiceSpecificFields(ServiceBooking booking, Map<String, Object> addOns) {
        if (addOns == null) return;

        try {
            // Extract veterinary medical data
            Object medicalData = addOns.get("medical");
            if (medicalData instanceof Map) {
                Map<String, Object> medical = (Map<String, Object>) medicalData;
                if (booking.getSymptoms() == null && medical.get("symptoms") != null) {
                    booking.setSymptoms(medical.get("symptoms").toString());
                }
                if (booking.getMedicalHistory() == null && medical.get("medicalHistory") != null) {
                    booking.setMedicalHistory(medical.get("medicalHistory").toString());
                }
                if (booking.getCurrentMedications() == null) {
                    Object medications = medical.get("medications");
                    if (medications == null) medications = medical.get("currentMedications");
                    if (medications != null) {
                        booking.setCurrentMedications(medications.toString());
                    }
                }
                if (booking.getUrgency() == null && medical.get("urgency") != null) {
                    booking.setUrgency(medical.get("urgency").toString());
                }
                if (booking.getPreferredPlatform() == null && medical.get("preferredPlatform") != null) {
                    booking.setPreferredPlatform(medical.get("preferredPlatform").toString());
                }
                if (booking.getHomeAddress() == null && medical.get("homeAddress") != null) {
                    booking.setHomeAddress(medical.get("homeAddress").toString());
                }
                if (booking.getAccessInstructions() == null && medical.get("accessInstructions") != null) {
                    booking.setAccessInstructions(medical.get("accessInstructions").toString());
                }
            }

            // Extract walking data
            if (booking.getWalkDuration() == null && addOns.get("duration") != null) {
                booking.setWalkDuration(addOns.get("duration").toString());
            }
            if (booking.getWalkingRules() == null && addOns.get("rules") instanceof Map) {
                booking.setWalkingRules((Map<String, Object>) addOns.get("rules"));
            }

            // Extract boarding data
            Object boardingExtras = addOns.get("boardingExtras");
            if (boardingExtras instanceof Map) {
                Map<String, Object> boarding = (Map<String, Object>) boardingExtras;
                if (booking.getEmergencyContact() == null && boarding.get("emergencyContact") != null) {
                    booking.setEmergencyContact(boarding.get("emergencyContact").toString());
                }
                if (booking.getVaccinationUpToDate() == null && boarding.get("vaccinationUpToDate") != null) {
                    booking.setVaccinationUpToDate(Boolean.valueOf(boarding.get("vaccinationUpToDate").toString()));
                }
                if (booking.getTemperament() == null && boarding.get("temperament") != null) {
                    booking.setTemperament(boarding.get("temperament").toString());
                }
            }

            // Extract grooming data  
            if (booking.getSelectedAddOns() == null && addOns.get("selectedAddOns") instanceof Map) {
                booking.setSelectedAddOns((Map<String, Object>) addOns.get("selectedAddOns"));
            }

        } catch (Exception e) {
            System.err.println("[WARNING] Failed to extract service-specific fields from addOns: " + e.getMessage());
        }
    }

    // Convert DTO to Entity
    private ServiceBooking convertToEntity(ServiceBookingDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("ServiceBookingDTO cannot be null");
        }
        
        ServiceBooking booking = new ServiceBooking();
        
        // Validate and set required fields with defaults
        booking.setPetName(dto.getPetName() != null && !dto.getPetName().trim().isEmpty() ? dto.getPetName().trim() : "Unknown Pet");
        booking.setPetType(dto.getPetType() != null && !dto.getPetType().trim().isEmpty() ? dto.getPetType().trim() : "unknown");
        booking.setPetBreed(dto.getPetBreed() != null ? dto.getPetBreed().trim() : null);
        booking.setPetAge(dto.getPetAge() != null ? dto.getPetAge().trim() : null);
        booking.setPetGender(dto.getPetGender() != null ? dto.getPetGender().trim() : null);
        booking.setPetDateOfBirth(dto.getPetDateOfBirth() != null ? dto.getPetDateOfBirth().trim() : null);
        
        // Handle pet photo upload to S3 (if available) or local storage
        if (dto.getPetPhotoBase64() != null && !dto.getPetPhotoBase64().trim().isEmpty()) {
            try {
                String imageUrl = null;
                
                // Try S3 first if S3ImageService is available
                if (s3ImageService != null) {
                    try {
                        imageUrl = uploadBase64ImageToS3(
                            dto.getPetPhotoBase64(),
                            dto.getPetPhotoOriginalName(),
                            dto.getPetPhotoContentType(),
                            dto.getPetName()
                        );
                        if (imageUrl != null) {
                            System.out.println("[DEBUG] Saved service pet photo to S3: " + imageUrl);
                        }
                    } catch (Exception s3e) {
                        System.err.println("[WARNING] S3 upload failed: " + s3e.getMessage());
                    }
                }
                
                // Fallback to local storage if S3 is not available or failed
                if (imageUrl == null) {
                    imageUrl = fileUploadService.saveBase64Image(
                        dto.getPetPhotoBase64(),
                        dto.getPetPhotoOriginalName(),
                        dto.getPetPhotoContentType(),
                        dto.getPetName()
                    );
                    System.out.println("[DEBUG] Saved service pet photo locally: " + imageUrl);
                }
                
                // Set the image URL (either S3 or local)
                if (imageUrl != null) {
                    booking.setPetPhotoPath(imageUrl);
                    booking.setPetPhotoOriginalName(dto.getPetPhotoOriginalName());
                    booking.setPetPhotoContentType(dto.getPetPhotoContentType());
                }
                
            } catch (Exception e) {
                System.err.println("[ERROR] Failed to save pet photo: " + e.getMessage());
                // Don't fail the booking if photo save fails
            }
        }
        
        // Set user relationship if userId is provided
        if (dto.getUserId() != null) {
            try {
                System.out.println("[DEBUG] Setting user relationship for userId: " + dto.getUserId());
                User user = userRepository.findById(dto.getUserId()).orElse(null);
                if (user != null) {
                    booking.setUser(user);
                    System.out.println("[DEBUG] Successfully set user relationship for: " + user.getEmail());
                } else {
                    System.err.println("[WARNING] User not found with ID: " + dto.getUserId());
                }
            } catch (Exception e) {
                System.err.println("[ERROR] Failed to find user with ID: " + dto.getUserId() + " - " + e.getMessage());
            }
        } else {
            System.out.println("[DEBUG] No userId provided in DTO, user relationship not set");
        }
        
        booking.setOwnerName(dto.getOwnerName() != null && !dto.getOwnerName().trim().isEmpty() ? dto.getOwnerName().trim() : "Unknown Owner");
        booking.setPhone(dto.getPhone() != null && !dto.getPhone().trim().isEmpty() ? dto.getPhone().trim() : "Unknown");
        booking.setEmail(dto.getEmail() != null ? dto.getEmail().trim() : null);
        booking.setAddress(dto.getAddress() != null && !dto.getAddress().trim().isEmpty() ? dto.getAddress().trim() : "Address not provided");
        
        // Set detailed address components
        booking.setAddressType(dto.getAddressType() != null ? dto.getAddressType().trim() : null);
        booking.setArea(dto.getArea() != null ? dto.getArea().trim() : null);
        booking.setCityStateCountry(dto.getCityStateCountry() != null ? dto.getCityStateCountry().trim() : null);
        booking.setHouseNumber(dto.getHouseNumber() != null ? dto.getHouseNumber().trim() : null);
        booking.setBuilding(dto.getBuilding() != null ? dto.getBuilding().trim() : null);
        booking.setFloor(dto.getFloor() != null ? dto.getFloor().trim() : null);
        booking.setLandmark(dto.getLandmark() != null ? dto.getLandmark().trim() : null);
        booking.setRecipientName(dto.getRecipientName() != null ? dto.getRecipientName().trim() : null);
        booking.setRecipientContactNumber(dto.getRecipientContactNumber() != null ? dto.getRecipientContactNumber().trim() : null);
        
        // Set GPS coordinates
        booking.setGpsLatitude(dto.getGpsLatitude());
        booking.setGpsLongitude(dto.getGpsLongitude());
        
        // Extract GPS from addOns if not directly provided
        if (booking.getGpsLatitude() == null && dto.getAddOns() != null) {
            try {
                @SuppressWarnings("unchecked")
                Map<String, Object> gps = (Map<String, Object>) dto.getAddOns().get("gps");
                if (gps != null) {
                    if (gps.get("lat") != null) {
                        booking.setGpsLatitude(Double.parseDouble(gps.get("lat").toString()));
                    }
                    if (gps.get("lng") != null) {
                        booking.setGpsLongitude(Double.parseDouble(gps.get("lng").toString()));
                    }
                }
            } catch (Exception e) {
                System.err.println("[WARNING] Failed to extract GPS from addOns: " + e.getMessage());
            }
        }
        
        booking.setServiceName(dto.getServiceName() != null && !dto.getServiceName().trim().isEmpty() ? dto.getServiceName().trim() : "Unknown Service");
        booking.setServiceType(dto.getServiceType() != null && !dto.getServiceType().trim().isEmpty() ? dto.getServiceType().trim() : "unknown");
        booking.setBasePrice(dto.getBasePrice() != null ? dto.getBasePrice() : 0.0);
        
        // Store optimized addOns without large data (images, detailed address, GPS)
        // to avoid database column size limits
        Map<String, Object> optimizedAddOns = new HashMap<>();
        if (dto.getAddOns() != null) {
            for (Map.Entry<String, Object> entry : dto.getAddOns().entrySet()) {
                String key = entry.getKey();
                Object value = entry.getValue();
                
                // Skip large data fields that are stored in dedicated columns
                if (!"petPhoto".equals(key) && !"addressDetails".equals(key) && !"gps".equals(key)) {
                    // Include only essential metadata (duration, rules, etc.)
                    optimizedAddOns.put(key, value);
                }
            }
        }
        booking.setAddOns(optimizedAddOns);
        
        booking.setTotalAmount(dto.getTotalAmount() != null ? dto.getTotalAmount() : 0.0);
        booking.setPreferredDate(dto.getPreferredDate());
        booking.setPreferredTime(dto.getPreferredTime() != null && !dto.getPreferredTime().trim().isEmpty() ? dto.getPreferredTime().trim() : "Not specified");
        booking.setSpecialInstructions(dto.getSpecialInstructions() != null ? dto.getSpecialInstructions().trim() : null);
        
        if (dto.getStatus() != null && !dto.getStatus().trim().isEmpty()) {
            booking.setStatus(dto.getStatus().trim());
        } else {
            booking.setStatus("PENDING");
        }

        // Map service-specific fields
        booking.setSymptoms(dto.getSymptoms());
        booking.setMedicalHistory(dto.getMedicalHistory());
        booking.setCurrentMedications(dto.getCurrentMedications());
        booking.setUrgency(dto.getUrgency());
        booking.setPreferredPlatform(dto.getPreferredPlatform());
        booking.setHomeAddress(dto.getHomeAddress());
        booking.setAccessInstructions(dto.getAccessInstructions());
        booking.setWalkDuration(dto.getWalkDuration());
        booking.setRoutePreference(dto.getRoutePreference());
        booking.setBehaviorNotes(dto.getBehaviorNotes());
        booking.setWalkingRules(dto.getWalkingRules());
        booking.setCheckInDate(dto.getCheckInDate());
        booking.setCheckOutDate(dto.getCheckOutDate());
        booking.setCheckInTime(dto.getCheckInTime());
        booking.setCheckOutTime(dto.getCheckOutTime());
        booking.setDietaryRequirements(dto.getDietaryRequirements());
        booking.setEmergencyContact(dto.getEmergencyContact());
        booking.setVaccinationUpToDate(dto.getVaccinationUpToDate());
        booking.setPackageType(dto.getPackageType());
        booking.setSelectedAddOns(dto.getSelectedAddOns());
        booking.setGroomingPreferences(dto.getGroomingPreferences());
        booking.setTemperament(dto.getTemperament());

        // Extract service-specific fields from addOns for backward compatibility
        if (dto.getAddOns() != null) {
            extractServiceSpecificFields(booking, dto.getAddOns());
        }
        
        return booking;
    }

    // Get bookings by service type
    public List<ServiceBookingDTO> getBookingsByServiceType(String serviceType) {
        return serviceBookingRepository.findByServiceTypeOrderByCreatedAtDesc(serviceType)
                .stream()
                .map(this::convertToDTO)
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }
    
    // Get specifically pet walking bookings
    public List<ServiceBookingDTO> getPetWalkingBookings() {
        System.out.println("[DEBUG] Getting pet walking bookings...");
        List<ServiceBooking> walkingBookings = serviceBookingRepository.findPetWalkingBookings();
        System.out.println("[DEBUG] Found " + walkingBookings.size() + " pet walking bookings");
        return walkingBookings.stream()
                .map(this::convertToDTO)
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }
    
    // Count pet walking bookings
    public Long countPetWalkingBookings() {
        Long count = serviceBookingRepository.countPetWalkingBookings();
        System.out.println("[DEBUG] Total pet walking bookings in database: " + count);
        return count;
    }
    
    /**
     * Helper method to upload base64 image data to S3
     * Converts base64 data and uploads directly to S3
     */
    private String uploadBase64ImageToS3(String base64Data, String originalFileName, String mimeType, String petName) {
        try {
            if (base64Data == null || base64Data.isEmpty()) {
                return null;
            }
            
            if (s3ImageService == null) {
                System.out.println("[DEBUG] S3ImageService not available, skipping S3 upload");
                return null;
            }
            
            // Remove data URL prefix if present (data:image/jpeg;base64,)
            String cleanBase64 = base64Data;
            if (base64Data.contains(",")) {
                cleanBase64 = base64Data.split(",")[1];
            }
            
            // Decode base64 data
            byte[] imageBytes = java.util.Base64.getDecoder().decode(cleanBase64);
            
            // Generate unique filename for S3
            String fileExtension = getFileExtension(originalFileName, mimeType);
            String timestamp = java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String uniqueId = java.util.UUID.randomUUID().toString().substring(0, 8);
            String sanitizedPetName = sanitizeFilename(petName);
            String fileName = String.format("services/%s_%s_%s.%s", sanitizedPetName, timestamp, uniqueId, fileExtension);
            
            // Upload directly to S3 using the S3Client
            software.amazon.awssdk.core.sync.RequestBody requestBody = software.amazon.awssdk.core.sync.RequestBody.fromBytes(imageBytes);
            software.amazon.awssdk.services.s3.model.PutObjectRequest putObjectRequest = software.amazon.awssdk.services.s3.model.PutObjectRequest.builder()
                    .bucket(s3ImageService.getBucketName())
                    .key(fileName)
                    .contentType(mimeType != null ? mimeType : "image/jpeg")
                    .contentLength((long) imageBytes.length)
                    .build();
            
            // Get S3Client from S3ImageService's constructor parameter or use reflection to access it
            // For now, let's create the URL manually after uploading
            software.amazon.awssdk.services.s3.S3Client s3Client = getS3Client();
            s3Client.putObject(putObjectRequest, requestBody);
            
            // Generate S3 URL
            String s3Url = String.format("https://%s.s3.ap-south-1.amazonaws.com/%s", 
                                       s3ImageService.getBucketName(), fileName);
            
            System.out.println("[DEBUG] Successfully uploaded service pet photo to S3: " + s3Url);
            return s3Url;
            
        } catch (Exception e) {
            System.err.println("[ERROR] Failed to upload base64 image to S3: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
    
    /**
     * Get file extension from filename or mime type
     */
    private String getFileExtension(String originalFileName, String mimeType) {
        if (originalFileName != null && originalFileName.contains(".")) {
            return originalFileName.substring(originalFileName.lastIndexOf(".") + 1).toLowerCase();
        }
        
        // Fallback to mime type
        if (mimeType != null) {
            switch (mimeType.toLowerCase()) {
                case "image/jpeg":
                case "image/jpg":
                    return "jpg";
                case "image/png":
                    return "png";
                case "image/gif":
                    return "gif";
                case "image/webp":
                    return "webp";
                default:
                    return "jpg";
            }
        }
        return "jpg";
    }
    
    /**
     * Sanitize filename for safe storage
     */
    private String sanitizeFilename(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "pet";
        }
        return filename.replaceAll("[^a-zA-Z0-9\\-_]", "").toLowerCase();
    }
    
    /**
     * Get S3Client - this is a simple approach, 
     * ideally we would inject S3Client directly but this works for now
     */
    private software.amazon.awssdk.services.s3.S3Client getS3Client() {
        return software.amazon.awssdk.services.s3.S3Client.builder()
                .region(software.amazon.awssdk.regions.Region.AP_SOUTH_1)
                .build();
    }

    // Inner class for booking statistics
    public static class BookingStats {
        private Long pending;
        private Long confirmed;
        private Long inProgress;
        private Long completed;
        private Long cancelled;
        private Long total;

        public BookingStats(Long pending, Long confirmed, Long inProgress, Long completed, Long cancelled) {
            this.pending = pending;
            this.confirmed = confirmed;
            this.inProgress = inProgress;
            this.completed = completed;
            this.cancelled = cancelled;
            this.total = pending + confirmed + inProgress + completed + cancelled;
        }

        // Getters
        public Long getPending() { return pending; }
        public Long getConfirmed() { return confirmed; }
        public Long getInProgress() { return inProgress; }
        public Long getCompleted() { return completed; }
        public Long getCancelled() { return cancelled; }
        public Long getTotal() { return total; }
    }
}