export function Overview() {
  return (
    <div className="w-full">
      <div className="flex justify-between border-b-2 border-b-slate-200/20 pb-3">
        <div className="flex flex-col justify-center items-center">
          <img
            className="w-10 h-10 rounded-full p-1 ring-2 ring-gray-500"
            src="https://i.pravatar.cc/250?u=julien"
            alt="Rounded avatar"
          />
          <span>Julienne</span>
        </div>

        <div className="flex flex-col justify-center">
          <img
            className="w-10 h-10 rounded-full p-1 ring-2 ring-gray-500"
            src="https://i.pravatar.cc/250?u=pacific"
            alt="Rounded avatar"
          />
          <span>Pacific</span>
        </div>
      </div>
    </div>
  );
}
