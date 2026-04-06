const gradeOrder = ["A+","A","A-","B+","B","B-","C+","C","C-","D+","D","D-"];

export function gradeToNumber(grade: string): number {
  const idx = gradeOrder.indexOf(grade);
  return idx === -1 ? 99 : idx;
}

export function getGradeColor(grade: string): string {
  if (grade === "A+" || grade === "A") return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900 dark:text-emerald-200 dark:border-emerald-700";
  if (grade === "A-") return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/70 dark:text-emerald-300 dark:border-emerald-700";
  if (grade === "B+") return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700";
  if (grade === "B") return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/70 dark:text-blue-300 dark:border-blue-700";
  if (grade === "B-") return "bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900 dark:text-sky-200 dark:border-sky-700";
  if (grade === "C+") return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-700";
  if (grade === "C") return "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700";
  if (grade === "C-") return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/70 dark:text-orange-300 dark:border-orange-700";
  if (grade === "D+") return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700";
  if (grade === "D") return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700";
  if (grade === "D-") return "bg-red-200 text-red-900 border-red-400 dark:bg-red-900 dark:text-red-100 dark:border-red-600";
  return "bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-600";
}
