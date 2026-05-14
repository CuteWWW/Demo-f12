export default function StatusChip({ status }) {
  const isAvailable = status === 'available';
  return (
    <span className={`status-chip ${isAvailable ? 'available' : 'borrowed'}`}>
      {isAvailable ? '可借' : '已借出'}
    </span>
  );
}
