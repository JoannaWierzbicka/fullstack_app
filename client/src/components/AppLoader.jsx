import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0% { transform: scale(0.92); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.92); opacity: 0.8; }
`;

const orbit = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export default function AppLoader({ label }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 120,
          height: 120,
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 30% 30%, rgba(51,180,172,0.35), rgba(31,60,74,0.2))',
          boxShadow: '0 25px 60px rgba(15, 36, 46, 0.25)',
          animation: `${pulse} 2.4s ease-in-out infinite`,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 12,
            borderRadius: '50%',
            border: '2px dashed rgba(195, 111, 43, 0.5)',
            animation: `${orbit} 6s linear infinite`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 28,
            borderRadius: '50%',
            border: '2px solid rgba(250, 247, 240, 0.7)',
            boxShadow: '0 10px 25px rgba(31, 60, 74, 0.22)',
          }}
        />
      </Box>

      {label ? (
        <Typography
          variant="body2"
          sx={{
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          {label}
        </Typography>
      ) : null}
    </Box>
  );
}
