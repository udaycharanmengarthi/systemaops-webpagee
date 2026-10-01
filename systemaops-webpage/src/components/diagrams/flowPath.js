/* ============================================================
   flowPath — straight or gently bowed connector.
   Bow offsets the quadratic control point perpendicular to the
   segment, so endpoints always land exactly on the nodes.
   ============================================================ */

export function flowPath(x1, y1, x2, y2, bow = 0) {
  if (!bow) return `M${x1} ${y1} L${x2} ${y2}`;

  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;

  const nx = -dy / len;
  const ny = dx / len;

  const cx = (mx + nx * bow).toFixed(1);
  const cy = (my + ny * bow).toFixed(1);

  return `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`;
}
