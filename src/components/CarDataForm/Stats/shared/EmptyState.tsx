type Props = { message: string };

export default function EmptyState({ message }: Props) {
  return (
    <div className="StatsEmptyState">
      <div className="StatsEmptyState__icon">◈</div>
      <p className="StatsEmptyState__text">{message}</p>
    </div>
  );
}