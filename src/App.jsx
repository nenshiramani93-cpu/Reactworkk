import { useEffect, useState } from "react";

export default function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [darkMode, setDarkMode] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  useEffect(() => {
    fetch("https://dummyjson.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
        setFilteredUsers(data.users);
      });
  }, []);

  const handleSearch = (e) => {
    const q = e.target.value.toLowerCase();
    setSearch(q);
    filterUsers(q, gender);
  };

  const handleGender = (e) => {
    const value = e.target.value;
    setGender(value);
    filterUsers(search, value);
  };

  const filterUsers = (q, genderValue) => {
    let temp = users;

    if (q) {
      temp = temp.filter((u) =>
        (u.firstName + " " + u.lastName).toLowerCase().includes(q)
      );
    }

    if (genderValue) {
      temp = temp.filter((u) => u.gender === genderValue);
    }

    setFilteredUsers(temp);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    const newOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";

    setSortField(field);
    setSortOrder(newOrder);

    setFilteredUsers((prev) =>
      [...prev].sort((a, b) => {
        if (a[field] < b[field]) return newOrder === "asc" ? -1 : 1;
        if (a[field] > b[field]) return newOrder === "asc" ? 1 : -1;
        return 0;
      })
    );
  };

  // Pagination Logic
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div
      className={`min-h-screen p-6 transition-all duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-blue-100 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto p-8 rounded-3xl shadow-2xl backdrop-blur-xl bg-white/20 border border-white/40 transition-all duration-500">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold drop-shadow-md">
            User Dashboard
          </h1>

          <button
            className="px-4 py-2 rounded-xl shadow bg-purple-600 text-white hover:bg-purple-800 transition"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={handleSearch}
            className="p-3 rounded-xl w-full bg-white/70 backdrop-blur border focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={gender}
            onChange={handleGender}
            className="p-3 rounded-xl w-full md:w-48 bg-white/70 backdrop-blur border focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-blue-600 text-white text-lg">
                {["id", "firstName", "lastName", "age", "gender"].map(
                  (field) => (
                    <th
                      key={field}
                      className="p-3 cursor-pointer hover:bg-blue-800 transition"
                      onClick={() => handleSort(field)}
                    >
                      {field.toUpperCase()} <span>▲▼</span>
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="bg-white/70 backdrop-blur text-gray-900">
              {currentUsers.map((u) => (
                <tr
                  className="border-b hover:bg-blue-200 transition"
                  key={u.id}
                >
                  <td className="p-3">{u.id}</td>
                  <td className="p-3">{u.firstName}</td>
                  <td className="p-3">{u.lastName}</td>
                  <td className="p-3">{u.age}</td>
                  <td className="p-3 capitalize">{u.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-lg ${
                currentPage === i + 1
                  ? "bg-blue-700 text-white"
                  : "bg-blue-300"
              }`}
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
