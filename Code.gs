function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function loginUser(projectNumber, bizNumber) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("시트1");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][4] == projectNumber && data[i][5] == bizNumber) {
      // No 제외한 나머지 정보 (index 1부터)
      const userInfo = {
        "연도": data[i][1],
        "과제명": data[i][2],
        "차수": data[i][3],
        "과제 번호": data[i][4],
        "사업자 번호": data[i][5],
        "기업명": data[i][6],
        "대표자명": data[i][7],
        "대표자 휴대폰 번호": data[i][8],
        "대표자 이메일": data[i][9],
        "담당자명(직책)": data[i][10],
        "담당자 휴대폰 번호": data[i][11],
        "담당자 이메일": data[i][12],
      };

      return {
        success: true,
        data: userInfo,
        rowIndex: i + 1
      };
    }
  }

  return { success: false, message: "일치하는 과제번호 및 사업자번호가 없습니다." };
}

function updateUser(rowIndex, updatedData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("시트1");

  // 수정 가능한 필드만 업데이트 (8~13번째 열 = I~M 열)
  const editableValues = [
    updatedData["대표자 휴대폰 번호"],
    updatedData["대표자 이메일"],
    updatedData["담당자명(직책)"],
    updatedData["담당자 휴대폰 번호"],
    updatedData["담당자 이메일"]
  ];


  // rowIndex 행의 I열(9번째 열)부터 5개 열을 덮어쓰기
  sheet.getRange(rowIndex, 9, 1, editableValues.length).setValues([editableValues]);

  return { success: true };
}


