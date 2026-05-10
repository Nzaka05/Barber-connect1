const categoryDefaults = {
    'Haircut': 30,
    'Beard': 15,
    'Facial': 45,
    'Massage': 60,
    'Other': 30
};

/**
 * Calculates the predicted duration for a service given a specific barber.
 * It uses the service's defined duration or category default, multiplied by the barber's performance factor.
 */
exports.predictDuration = (service, barber) => {
    const baseDuration = service.duration || categoryDefaults[service.category] || 30;
    const speedFactor = barber.performanceMetrics ? barber.performanceMetrics.avgSpeedFactor : 1.0;
    const buffer = barber.bufferTime || 0;

    return Math.ceil(baseDuration * speedFactor) + buffer;
};

/**
 * Updates a barber's performance metrics based on a completed booking.
 */
exports.updatePerformance = async (barber, booking) => {
    if (!booking.actualStartTime || !booking.actualEndTime) return;

    const actualDuration = (booking.actualEndTime - booking.actualStartTime) / (1000 * 60);
    const estimatedDuration = booking.estimatedDuration || predictDuration(booking.service, barber);

    const performanceRatio = actualDuration / estimatedDuration;

    // Weighted average to update speed factor (moving average)
    const weight = 0.1; // Adjust how fast the system "learns"
    const currentFactor = barber.performanceMetrics.avgSpeedFactor;
    barber.performanceMetrics.avgSpeedFactor = (currentFactor * (1 - weight)) + (performanceRatio * weight);
    barber.performanceMetrics.completedBookings += 1;

    await barber.save();
};
