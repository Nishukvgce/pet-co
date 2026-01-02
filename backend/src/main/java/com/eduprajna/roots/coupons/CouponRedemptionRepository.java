package com.eduprajna.roots.coupons;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponRedemptionRepository extends JpaRepository<CouponRedemption, Long> {
    boolean existsByCoupon_IdAndUser_Id(Long couponId, Long userId);
}
