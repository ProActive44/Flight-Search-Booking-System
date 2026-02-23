// Generates a short unique booking ID: BK-<timestamp snippet>-<random 4 chars>
// Example: BK-08729391-X4KP
export const generateBookingId = (): string => {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `BK-${timestamp}-${random}`;
};
