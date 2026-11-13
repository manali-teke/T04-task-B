const form = document.getElementById("grade-form");
const statusEl = document.getElementById("status");
const noteCounter = document.getElementById("note-counter");
const result = document.getElementById("result");

function readForm() {
  const data = {};
  for (const field of FIELDS) {
    data[field] = document.getElementById(field).value;
  }
  return data;
}

function validateGrades(data) {
  const errors = {};

  for (const field of SCORE_FIELDS) {
    const value = data[field].trim();
    if (!SCORE_PATTERN.test(value) || Number(value) > 100) {
      errors[field] = "Enter a score from 0 to 100, like 87.25.";
    }
  }

  if (data.extra.trim() !== "") {
    const extra = Number(data.extra.trim());
    if (!Number.isInteger(extra) || extra < 0 || extra > MAX_EXTRA) {
      errors.extra = `Extra credit must be a whole number from 0 to ${MAX_EXTRA}.`;
    }
  }

  if (data.note.length > MAX_NOTE) {
    errors.note = `Note must be ${MAX_NOTE} characters or fewer.`;
  }

  return errors;
}

function calculateGrade(data) {
  const homework = Number(data.homework);
  const midterm = Number(data.midterm);
  const final = Number(data.final);
  const extra = data.extra.trim() === "" ? 0 : Number(data.extra.trim());

  const weighted =
    homework * HOMEWORK_WEIGHT + midterm * MIDTERM_WEIGHT + final * FINAL_WEIGHT;
  return Math.min(100, weighted + extra);
}

function letterGrade(grade) {
  if (grade > 90) return "A";
  if (grade >= 80) return "B";
  if (grade >= 70) return "C";
  if (grade >= 60) return "D";
  return "F";
}

function showErrors(errors) {
  for (const field of FIELDS) {
    document.getElementById(`${field}-error`).textContent = errors[field] || "";
  }
}

function showResult(grade, data) {
  const heading = document.createElement("h2");
  heading.textContent = `${grade.toFixed(1)} (${letterGrade(grade)})`;
  const note = document.createElement("p");
  note.textContent = data.note;
  note.style.whiteSpace = "pre-wrap";
  result.replaceChildren(heading, note);
  result.hidden = false;
}

document.getElementById("note").addEventListener("input", (event) => {
  noteCounter.textContent = `${event.target.value.length}/${MAX_NOTE}`;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = readForm();
  const errors = validateGrades(data);
  showErrors(errors);

  if (Object.keys(errors).length > 0) {
    statusEl.textContent = "Please fix the highlighted fields.";
    form.reset();
    return;
  }

  statusEl.textContent = "Grade calculated.";
  showResult(calculateGrade(data), data);

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
