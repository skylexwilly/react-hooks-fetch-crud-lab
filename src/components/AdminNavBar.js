 function AdminNavBar({ onChangePage }) {
  return (
    <nav>
      <button onClick={() => onChangePage("form")}>Add Question</button>
      <button onClick={() => onChangePage("list")}>View Questions</button>
    </nav>
  );
}
export default AdminNavBar;
