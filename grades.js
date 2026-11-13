
const form = document.getElementById("grade-form");
const statusEl = document.getElementById("status");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const homework = Number(document.getElementById("homework").value);
  const midterm = Number(document.getElementById("midterm").value);
  const finalExam = Number(document.getElementById("final").value);
  const extra = Number(document.getElementById("extra").value || 0);

  // Validate required grades
  if (
    !document.getElementById("homework").value.trim() ||
    !document.getElementById("midterm").value.trim() ||
    !document.getElementById("final").value.trim()
  ) {
    statusEl.textContent = "Please enter all required grades.";
    return;
  }

  if (
    !Number.isFinite(homework) ||
    !Number.isFinite(midterm) ||
    !Number.isFinite(finalExam) ||
    !Number.isFinite(extra) ||
    homework < 0 || homework > 100 ||
    midterm < 0 || midterm > 100 ||
    finalExam < 0 || finalExam > 100 ||
    extra < 0 || extra > 5
  ) {
    statusEl.textContent = "Enter valid grades between 0 and 100 and extra credit between 0 and 5.";
    return;
  }

  // Calculate weighted course grade
  const grade = (homework * 0.3) +
                (midterm * 0.3) +
                (finalExam * 0.4) +
                extra;

  // Determine letter grade
  let letterGrade;

  if (grade >= 90) {
    letterGrade = "A";
  } else if (grade >= 80) {
    letterGrade = "B";
  } else if (grade >= 70) {
    letterGrade = "C";
  } else if (grade >= 60) {
    letterGrade = "D";
  } else {
    letterGrade = "F";
  }

  statusEl.textContent =
    `Your course grade is ${grade.toFixed(2)}% (${letterGrade}).`;
});
