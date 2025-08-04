// holidays-jp-from-2020.ts
/**
 * @file 祝日データと関連ユーティリティのテンプレート
 * @module holidays-jp-template
 */

/**
 * 祝日データを格納するオブジェクト。
 * キーは 'YYYY-MM-DD' 形式の日付文字列、値は祝日名。
 * @type { [key: string]: string }
 */
export const holidays: { [key: string]: string } = {
  '2020-01-01': '元日',
  '2020-01-13': '成人の日',
  '2020-02-11': '建国記念の日',
  '2020-02-23': '天皇誕生日',
  '2020-02-24': '休日',
  '2020-03-20': '春分の日',
  '2020-04-29': '昭和の日',
  '2020-05-03': '憲法記念日',
  '2020-05-04': 'みどりの日',
  '2020-05-05': 'こどもの日',
  '2020-05-06': '休日',
  '2020-07-23': '海の日',
  '2020-07-24': 'スポーツの日',
  '2020-08-10': '山の日',
  '2020-09-21': '敬老の日',
  '2020-09-22': '秋分の日',
  '2020-11-03': '文化の日',
  '2020-11-23': '勤労感謝の日',
  '2021-01-01': '元日',
  '2021-01-11': '成人の日',
  '2021-02-11': '建国記念の日',
  '2021-02-23': '天皇誕生日',
  '2021-03-20': '春分の日',
  '2021-04-29': '昭和の日',
  '2021-05-03': '憲法記念日',
  '2021-05-04': 'みどりの日',
  '2021-05-05': 'こどもの日',
  '2021-07-22': '海の日',
  '2021-07-23': 'スポーツの日',
  '2021-08-08': '山の日',
  '2021-08-09': '休日',
  '2021-09-20': '敬老の日',
  '2021-09-23': '秋分の日',
  '2021-11-03': '文化の日',
  '2021-11-23': '勤労感謝の日',
  '2022-01-01': '元日',
  '2022-01-10': '成人の日',
  '2022-02-11': '建国記念の日',
  '2022-02-23': '天皇誕生日',
  '2022-03-21': '春分の日',
  '2022-04-29': '昭和の日',
  '2022-05-03': '憲法記念日',
  '2022-05-04': 'みどりの日',
  '2022-05-05': 'こどもの日',
  '2022-07-18': '海の日',
  '2022-08-11': '山の日',
  '2022-09-19': '敬老の日',
  '2022-09-23': '秋分の日',
  '2022-10-10': 'スポーツの日',
  '2022-11-03': '文化の日',
  '2022-11-23': '勤労感謝の日',
  '2023-01-01': '元日',
  '2023-01-02': '休日',
  '2023-01-09': '成人の日',
  '2023-02-11': '建国記念の日',
  '2023-02-23': '天皇誕生日',
  '2023-03-21': '春分の日',
  '2023-04-29': '昭和の日',
  '2023-05-03': '憲法記念日',
  '2023-05-04': 'みどりの日',
  '2023-05-05': 'こどもの日',
  '2023-07-17': '海の日',
  '2023-08-11': '山の日',
  '2023-09-18': '敬老の日',
  '2023-09-23': '秋分の日',
  '2023-10-09': 'スポーツの日',
  '2023-11-03': '文化の日',
  '2023-11-23': '勤労感謝の日',
  '2024-01-01': '元日',
  '2024-01-08': '成人の日',
  '2024-02-11': '建国記念の日',
  '2024-02-12': '休日',
  '2024-02-23': '天皇誕生日',
  '2024-03-20': '春分の日',
  '2024-04-29': '昭和の日',
  '2024-05-03': '憲法記念日',
  '2024-05-04': 'みどりの日',
  '2024-05-05': 'こどもの日',
  '2024-05-06': '休日',
  '2024-07-15': '海の日',
  '2024-08-11': '山の日',
  '2024-08-12': '休日',
  '2024-09-16': '敬老の日',
  '2024-09-22': '秋分の日',
  '2024-09-23': '休日',
  '2024-10-14': 'スポーツの日',
  '2024-11-03': '文化の日',
  '2024-11-04': '休日',
  '2024-11-23': '勤労感謝の日',
  '2025-01-01': '元日',
  '2025-01-13': '成人の日',
  '2025-02-11': '建国記念の日',
  '2025-02-23': '天皇誕生日',
  '2025-02-24': '休日',
  '2025-03-20': '春分の日',
  '2025-04-29': '昭和の日',
  '2025-05-03': '憲法記念日',
  '2025-05-04': 'みどりの日',
  '2025-05-05': 'こどもの日',
  '2025-05-06': '休日',
  '2025-07-21': '海の日',
  '2025-08-11': '山の日',
  '2025-09-15': '敬老の日',
  '2025-09-23': '秋分の日',
  '2025-10-13': 'スポーツの日',
  '2025-11-03': '文化の日',
  '2025-11-23': '勤労感謝の日',
  '2025-11-24': '休日',
  '2026-01-01': '元日',
  '2026-01-12': '成人の日',
  '2026-02-11': '建国記念の日',
  '2026-02-23': '天皇誕生日',
  '2026-03-20': '春分の日',
  '2026-04-29': '昭和の日',
  '2026-05-03': '憲法記念日',
  '2026-05-04': 'みどりの日',
  '2026-05-05': 'こどもの日',
  '2026-05-06': '休日',
  '2026-07-20': '海の日',
  '2026-08-11': '山の日',
  '2026-09-21': '敬老の日',
  '2026-09-22': '休日',
  '2026-09-23': '秋分の日',
  '2026-10-12': 'スポーツの日',
  '2026-11-03': '文化の日',
  '2026-11-23': '勤労感謝の日',
};

/**
 * Dateオブジェクトまたは日付文字列を 'YYYY-MM-DD' 形式の文字列に変換します。
 * @param {string | Date} date - 変換する日付。
 * @returns {string | null} 'YYYY-MM-DD' 形式の日付文字列。無効な日付の場合は `null`。
 */
const toDateString = (date: string | Date): string | null => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Invalid Dateオブジェクトの場合はnullを返す
  if (Number.isNaN(dateObj.getTime())) {
    return null;
  }

  const yyyy = dateObj.getFullYear();
  const mm = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const dd = dateObj.getDate().toString().padStart(2, '0');
  return [yyyy, mm, dd].join('-');
};

/**
 * 指定された日付が日本の祝日であるかどうかを判定します。
 * @param {string | Date} date - 判定する日付。文字列の場合は'YYYY-MM-DD'形式。
 * @returns {boolean} 祝日であれば `true`、そうでなければ `false`。
 */
export const isHoliday = (date: string | Date): boolean => {
  const key = toDateString(date);
  if (key === null) {
    return false;
  }
  return key in holidays;
};

/**
 * 指定された日付の祝日名を取得します。
 * @param {string | Date} date - 祝日名を取得する日付。文字列の場合は'YYYY-MM-DD'形式。
 * @returns {string | null} 祝日名。祝日でない場合は `null`。
 */
export const getHolidayName = (date: string | Date): string | null => {
  const key = toDateString(date);
  if (key === null) {
    return null;
  }
  return holidays[key] || null;
};

/**
 * 指定された日付が営業日（土日祝以外）であるかどうかを判定します。
 * @param {string | Date} date - 判定する日付。文字列の場合は'YYYY-MM-DD'形式。
 * @returns {boolean} 営業日であれば `true`、そうでなければ `false`。
 */
export const isBusinessDay = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // 無効な日付の場合はfalseを返す
  if (Number.isNaN(dateObj.getTime())) {
    return false;
  }

  const dayOfWeek = dateObj.getDay();

  // 土日の場合はfalse
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }

  // 祝日の場合はfalse（isHolidayで例外処理済み）
  return !isHoliday(date);
};

/**
 * 指定された日付からN営業日後（前）の日付を計算します。
 * @param {string | Date} date - 基準となる日付。文字列の場合は'YYYY-MM-DD'形式。
 * @param {number} days - 加算する営業日数（正なら未来方向、負なら過去方向）。
 * @param {"next" | "previous" | "none"} adjustment - 基準日の調整方法。
 *   省略時は days >= 0 なら "next"、days < 0 なら "previous"。
 *   - "next": 基準日が営業日でない場合、次の営業日に調整してから計算
 *   - "previous": 基準日が営業日でない場合、前の営業日に調整してから計算
 *   - "none": 基準日をそのまま使用（営業日でなくても調整しない）
 * @returns {string | null} 計算結果の日付（'YYYY-MM-DD'形式）。無効な日付の場合は `null`。
 */
export const offsetInBusinessDays = (
  date: string | Date,
  days: number,
  adjustment?: 'next' | 'previous' | 'none'
): string | null => {
  const startDateObj = typeof date === 'string' ? new Date(date) : date;

  // 無効な日付の場合はnullを返す
  if (Number.isNaN(startDateObj.getTime())) {
    return null;
  }

  // スマートデフォルトの決定
  const actualAdjustment = adjustment ?? (days >= 0 ? 'next' : 'previous');

  // 時間を00:00:00に統一したDateオブジェクト作成
  const currentDate = new Date(
    startDateObj.getFullYear(),
    startDateObj.getMonth(),
    startDateObj.getDate()
  );

  // 基準日を調整
  if (actualAdjustment !== 'none') {
    const step = actualAdjustment === 'next' ? 1 : -1;
    while (!isBusinessDay(currentDate)) {
      currentDate.setDate(currentDate.getDate() + step);
    }
  }

  // 営業日を加算/減算
  const direction = days > 0 ? 1 : -1;
  let remainingDays = Math.abs(days);

  while (remainingDays > 0) {
    currentDate.setDate(currentDate.getDate() + direction);

    if (isBusinessDay(currentDate)) {
      remainingDays--;
    }
  }

  return toDateString(currentDate);
};
