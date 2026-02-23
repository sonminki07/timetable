/**
 * 전체 텍스트를 분석하여 그룹별 데이터 배열로 분리합니다.
 */
export function splitBulkText(text: string): string[] {
  const trimmedText = text.trim();
  if (!trimmedText) return [];

  // 정규식 내 줄바꿈 오류 수정
  const groupMarkerRegex = /(?:^|\n)그룹\s*\d+/g;
  let groupData: string[] = [];

  if (groupMarkerRegex.test(trimmedText)) {
    groupData = trimmedText
      .split(groupMarkerRegex)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  } else {
    groupData = trimmedText
      .split(/\n\s*\n/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return groupData.slice(0, 10);
}
