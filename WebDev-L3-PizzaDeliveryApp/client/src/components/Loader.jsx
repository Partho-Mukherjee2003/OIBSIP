const styles = `
@keyframes pzSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.pz-spin { animation: pzSpin 2.5s linear infinite; transform-origin: center; }

@media (prefers-reduced-motion: reduce) {
  .pz-spin { animation: none; }
}
`;

const Loader = () => {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5">
      <style>{styles}</style>

      {/* Gol pizza — 6 slice, ghure */}
      <svg viewBox="0 0 100 100" className="pz-spin size-28 drop-shadow-lg">
        {/* Crust (bairer gol) */}
        <circle cx="50" cy="50" r="48" fill="#E07F0A" />
        {/* Cheese (vitorer gol) */}
        <circle cx="50" cy="50" r="42" fill="#F7C948" />

        {/* Slice kata dag (6ta) */}
        <g stroke="#E07F0A" strokeWidth="2.5">
          <line x1="50" y1="50" x2="50" y2="8" />
          <line x1="50" y1="50" x2="86.4" y2="29" />
          <line x1="50" y1="50" x2="86.4" y2="71" />
          <line x1="50" y1="50" x2="50" y2="92" />
          <line x1="50" y1="50" x2="13.6" y2="71" />
          <line x1="50" y1="50" x2="13.6" y2="29" />
        </g>

        {/* Pepperoni */}
        <circle cx="50" cy="28" r="5" fill="#C0392B" />
        <circle cx="68" cy="42" r="5" fill="#C0392B" />
        <circle cx="62" cy="66" r="5" fill="#C0392B" />
        <circle cx="38" cy="68" r="5" fill="#C0392B" />
        <circle cx="30" cy="44" r="5" fill="#C0392B" />
        <circle cx="50" cy="50" r="4" fill="#C0392B" />
      </svg>

      <p className="text-sm font-bold uppercase tracking-widest text-[#F7941D]">
        Loading...
      </p>
    </div>
  );
};

export default Loader;
