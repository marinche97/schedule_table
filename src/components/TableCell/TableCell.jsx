import "./TableCell.css";

function TableCell({
  subjects,
  groups,
  selectedSubject = [],
  selectedGroup = [],
  adminMode,
  onChangeSubject,
  onChangeGroup,
}) {
  const subjectCount = subjects.length === 1 ? 1 : 3;

  return (
    <td className="table-cell-content">
      {[...Array(subjectCount)].map((_, idx) => (
        <span key={idx} className="select-row">
          {adminMode ? (
            <>
              <select
                className="subject-select"
                value={selectedSubject[idx] || ""}
                onChange={(e) => onChangeSubject(idx, e.target.value)}
              >
                <option value="">Odaberi predmet</option>
                {subjects.map((subject) => (
                  <option value={subject} key={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              <select
                className="group-select"
                value={selectedGroup[idx] || ""}
                onChange={(e) => onChangeGroup(idx, e.target.value)}
              >
                <option value="">Odaberi grupu</option>
                {groups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <>
              <span>{selectedSubject[idx] || ""}</span>
              <span>{selectedGroup[idx] || ""}</span>
            </>
          )}
        </span>
      ))}
    </td>
  );
}

export default TableCell;
