import { Search } from "lucide-react";

const MemberSelector = ({ 
  members, 
  selectedMembers, 
  onToggleMember, 
  onSelectAll, 
  searchValue, 
  onSearchChange,
  buttonColor = "blue"
}) => {
  const filteredMembers = members.filter((m) =>
    m.toLowerCase().includes(searchValue.toLowerCase())
  );

  const allSelected = members.every((m) => selectedMembers.includes(m));

  return (
    <div>
      <div className="flex items-center gap-2 mt-2">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search members..."
          className="border rounded px-2 py-1 w-full"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button
          type="button"
          onClick={() => onSelectAll(allSelected ? [] : members)}
          className={`text-sm text-${buttonColor}-600 font-semibold border border-${buttonColor}-300 px-3 py-1 rounded hover:bg-${buttonColor}-100`}
        >
          {allSelected ? "Deselect All" : "Select All"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-3 max-h-32 overflow-y-auto">
        {filteredMembers.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onToggleMember(m)}
            className={`px-3 py-1 rounded-full text-sm border ${
              selectedMembers.includes(m)
                ? `bg-${buttonColor}-100 border-${buttonColor}-400`
                : "border-gray-300"
            }`}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MemberSelector;