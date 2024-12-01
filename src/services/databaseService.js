import { database } from "../firebase";
import { ref, set, push, get, remove, update } from "firebase/database";

// Dodaj podatke u Firebase bazu
export function addData(week, day, subject) {
  const dbRef = ref(database, "schedule/");
  const newEntryRef = push(dbRef);
  return set(newEntryRef, {
    week,
    day,
    subject,
  });
}

// Dohvati podatke o rasporedu iz Firebase baze
export async function fetchSchedule(grade) {
  const validGrade =
    typeof grade === "string" ? grade.replace(".", "-") : grade; // Provjera tipa
  const scheduleRef = ref(database, `schedules/${validGrade}`);
  const snapshot = await get(scheduleRef);
  return snapshot.exists() ? snapshot.val() : null;
}

// Pohrani cijeli raspored u Firebase bazu
export async function saveSchedule(grade, schedule) {
  const validGrade =
    typeof grade === "string" ? grade.replace(".", "-") : grade; // Provjera tipa
  const scheduleRef = ref(database, `schedules/${validGrade}`);
  return update(scheduleRef, schedule);
}

// Obriši tjedan iz Firebase baze
export async function deleteWeekData(grade, weekNumber) {
  const validGrade =
    typeof grade === "string" ? grade.replace(".", "-") : grade; // Provjera tipa
  const weekRef = ref(database, `schedules/${validGrade}/data/${weekNumber}`);
  return remove(weekRef);
}
