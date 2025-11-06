export const DEFAULT_RESERVATION_STATUS = 'preliminary';

export const RESERVATION_STATUS_META = {
  preliminary: {
    labelKey: 'reservationStatus.preliminary',
    background: 'rgba(212, 152, 69, 0.15)',
    color: '#C36F2B',
  },
  deposit_paid: {
    labelKey: 'reservationStatus.depositPaid',
    background: 'rgba(92, 164, 117, 0.18)',
    color: '#3D7A5A',
  },
  confirmed: {
    labelKey: 'reservationStatus.confirmed',
    background: 'rgba(31, 60, 74, 0.18)',
    color: '#1F3C4A',
  },
  booking: {
    labelKey: 'reservationStatus.booking',
    background: 'rgba(51, 180, 172, 0.18)',
    color: '#1E746E',
  },
  past: {
    labelKey: 'reservationStatus.past',
    background: 'rgba(94, 79, 69, 0.16)',
    color: '#5E4F45',
  },
};

export const RESERVATION_STATUS_OPTIONS = Object.entries(RESERVATION_STATUS_META)
  .filter(([value]) => value !== 'past')
  .map(([value, meta]) => ({
    value,
    ...meta,
  }));

export const getReservationStatusMeta = (status) =>
  RESERVATION_STATUS_META[status] ?? RESERVATION_STATUS_META.preliminary;
