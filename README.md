# Google-Sheet-WebApp
구글 스프레드 시트를 활용하여 제작한 웹앱. 각 기업의 담당자들이 직접 자신들의 기업 정보를 수정할 수 있도록 하기 위해 개발.

URL : https://script.google.com/macros/s/AKfycbwF1ouxRecIeyxZ7Xk9tgMd5dxqJcVH4PkPIcqKqyUDud-iaPAdUwHccg9ngebw2YRdtQ/exec

접근 가능 계정

<img src="https://github.com/user-attachments/assets/65fa6076-ac9c-4431-9e21-0b448d377eae" style="width: 300px; height: auto;"/>

</br>

## 화면

### 로그인
<img src="https://github.com/user-attachments/assets/eb625aa9-46d6-4d6a-ac5b-b00b4a8c35b7" style="width: 600px; height: auto;"/>

</br>

### 조회 및 수정
<img src="https://github.com/user-attachments/assets/2c969900-1325-4492-a736-88880d046e4a" style="width: 600px; height: auto;"/>

</br>

### 데이터 수정 시 검증
<img src="https://github.com/user-attachments/assets/92abfe6c-3108-4d3e-a899-6e72edb63869" style="width: 600px; height: auto;"/>

</br>

## 개발 동기
최근 비개발자인 친구가 회사에서 업무 부담을 줄이기 위해 기업들의 데이터를 각 기업의 담당자들이 직접 수정할 수 있도록 하고 싶어 방법을 찾고 있다는 이야기를 들어 시작하게 되었다.

물론 실제 어플리케이션을 개발하면 쉽게 제작할 수 있는 내용이나 아무래도 비개발자가 이를 운영하기 위한 인프라 및 유지보수를 진행하기엔 무리가 있다 판단하였다.

그러던 중 구글 스프레드 시트로 웹앱을 제작할 수 있다는 것을 알게되어 이를 활용하여 진행하게 되었다.

</br>

## 개발 과정
구글 스프레드 시트의 앱 스크립트를 활용하여 개발을 진행하였다.

스프레드 시트의 [확장 프로그램] 메뉴에서 [Apps Script]에서 시작할 수 있다.

<img src="https://github.com/user-attachments/assets/9e3343b5-a6c5-4cf3-b00d-3476477696cb" style="width: 600px; height: auto;" />

초기 생성 시 아래와 같이 gs 파일를 마주하게 되는데</br>
<img src="https://github.com/user-attachments/assets/22de089a-9d21-40cc-a8cb-a6f03c113c2a" style="width: 600px; height: auto;"/>

gs 코드의 정확한 문법을 알지 못하지만 걱정할 필요 없다. ChatGPT를 활용하면 되니까.

</br>

## Apps Script 기본 파악
우선 기본적인 동작 방식을 알아보기 위해 간단한 데이터로 기능만 동작할 수 있도록 구현해달라 요청하였다.

<img src="https://github.com/user-attachments/assets/92cf0b09-d5d1-4517-b4fb-a535bf026b57" style="width: 600px; height: auto;"/>

<img src="https://github.com/user-attachments/assets/5448bd71-538d-41b3-89bb-016e4a99f32e" style="width: 600px; height: auto;"/>

</br>
</br>

<details>
  <summary>GPT가 작성해준 코드</summary>

Code.gs
```
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
    if (data[i][0] == projectNumber && data[i][1] == bizNumber) {
      return {
        success: true,
        name: data[i][2],
        phone: data[i][3],
        email: data[i][4],
        rowIndex: i + 1
      };
    }
  }

  return { success: false, message: "일치하는 정보가 없습니다." };
}

function updateUser(rowIndex, name, phone, email) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("시트1");
  sheet.getRange(rowIndex, 3).setValue(name);
  sheet.getRange(rowIndex, 4).setValue(phone);
  sheet.getRange(rowIndex, 5).setValue(email);
  return { success: true };
}
```

index.html
```
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      body { font-family: Arial; margin: 20px; }
      input { margin-bottom: 10px; display: block; }
    </style>
  </head>
  <body>
    <h2>로그인</h2>
    <input type="text" id="projectNumber" placeholder="과제번호">
    <input type="text" id="bizNumber" placeholder="사업자번호">
    <button onclick="login()">로그인</button>

    <div id="userInfo" style="display:none;">
      <h3>내 정보</h3>
      <input type="text" id="name" placeholder="담당자명">
      <input type="text" id="phone" placeholder="휴대폰번호">
      <input type="text" id="email" placeholder="이메일">
      <button onclick="update()">정보 수정</button>
    </div>

    <script>
      let currentRow = null;

      function login() {
        const projectNumber = document.getElementById('projectNumber').value;
        const bizNumber = document.getElementById('bizNumber').value;

        google.script.run.withSuccessHandler(function(response) {
          if (response.success) {
            currentRow = response.rowIndex;
            document.getElementById('userInfo').style.display = 'block';
            document.getElementById('name').value = response.name;
            document.getElementById('phone').value = response.phone;
            document.getElementById('email').value = response.email;
          } else {
            alert(response.message);
          }
        }).loginUser(projectNumber, bizNumber);
      }

      function update() {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;

        google.script.run.withSuccessHandler(function(res) {
          if (res.success) alert('정보가 수정되었습니다!');
        }).updateUser(currentRow, name, phone, email);
      }
    </script>
  </body>
</html>
```
</details>
</br>

해당 파일들을 내 프로젝트에 추가해 주고 정상적으로 동작할 수 있도록 이에 맞춰 스프레드 시트에 데이터를 추가해주었다.

<img src="https://github.com/user-attachments/assets/4d534016-85d5-40e7-81d7-adf25146da1c" style="width: 600px; height: auto;"/>

우측 상단의 [배포] 버튼을 통하여 웹앱을 배포할 수 있다.

[배포] > [새 배포] > [유형 선택] 우측 톱니바퀴 > [웹 앱] 후 아래와 같이 작성

(설명은 내가 알아보기 위한 설명이라 내용 무관)

<img src="https://github.com/user-attachments/assets/643cb18b-fe00-4210-82ac-dfaf57a22d88" style="width: 600px; height: auto;"/>


만일 액세스 허용을 요청하는 문구가 나온다면 허용을 진행해주자.

배포를 완료한다면 아래와 같이 URL이 나오고 접속하면 HTML로 구현된 화면을 확인할 수 있다.

<img src="https://github.com/user-attachments/assets/7ccc6e5d-cbdc-49ea-a89b-2e2dd0cc4890" style="width: 600px; height: auto;"/>

<img src="https://github.com/user-attachments/assets/5f3eaee2-86a6-46d1-932f-62b6faabc82f" style="width: 600px; height: auto;"/>

그 후 스프레드 시트에 등록된 정보를 입력하면 아래와 같아 정상적으로 조회/수정이 가능하며 시트에도 변경된 내용이 반영된 것을 확인할 수 있다.

<img src="https://github.com/user-attachments/assets/deb0df59-758f-4b5e-86a8-9822630fa7cf" style="width: 600px; height: auto;"/>

<img src="https://github.com/user-attachments/assets/43d6346f-ebc5-491d-895a-454dd81fefbe" style="width: 600px; height: auto;"/>

</br>

## 고도화 진행
이제 어느정도 어떻게 동작하는지에 대해 이해하였으니 정확한 요구사항을 전달하여 요청하였다.
<img src="https://github.com/user-attachments/assets/156a89f2-6364-443f-890b-f3b437ae7640" style="width: 600px; height: auto;"/>

</br>

<details>
  <summary>GPT가 작성해준 코드</summary>
  </br>
  
  Code.gs

```
function loginUser(projectNumber, bizNumber) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("시트1");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][4] == projectNumber && data[i][5] == bizNumber) {
      // No 제외한 나머지 정보 (index 1부터)
      const userInfo = {
        연도: data[i][1],
        과제명: data[i][2],
        차수: data[i][3],
        과제번호: data[i][4],
        사업자번호: data[i][5],
        기업명: data[i][6],
        대표자명: data[i][7],
        대표자휴대폰번호: data[i][8],
        대표자이메일: data[i][9],
        담당자명직책: data[i][10],
        담당자휴대폰번호: data[i][11],
        담당자이메일: data[i][12],
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

  // No는 건너뛰고 2번째 열(B열)부터 M열까지 갱신
  const values = [
    updatedData.연도,
    updatedData.과제명,
    updatedData.차수,
    updatedData.과제번호,
    updatedData.사업자번호,
    updatedData.기업명,
    updatedData.대표자명,
    updatedData.대표자휴대폰번호,
    updatedData.대표자이메일,
    updatedData.담당자명직책,
    updatedData.담당자휴대폰번호,
    updatedData.담당자이메일,
  ];

  sheet.getRange(rowIndex, 2, 1, values.length).setValues([values]);

  return { success: true };
}
```

index.html
```
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        background-color: #f0f2f5;
        padding: 40px;
      }
      .container {
        max-width: 500px;
        margin: auto;
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      h2 {
        text-align: center;
        color: #333;
      }
      label {
        display: block;
        margin-top: 10px;
        font-weight: bold;
        color: #555;
      }
      input {
        width: 100%;
        padding: 10px;
        margin-top: 5px;
        border: 1px solid #ccc;
        border-radius: 6px;
        box-sizing: border-box;
      }
      button {
        width: 100%;
        margin-top: 20px;
        padding: 12px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        cursor: pointer;
      }
      #userInfo {
        display: none;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>사용자 로그인</h2>

      <label for="projectNumber">과제번호</label>
      <input type="text" id="projectNumber" placeholder="예: PRJ-1234">

      <label for="bizNumber">사업자번호</label>
      <input type="text" id="bizNumber" placeholder="예: 123-45-67890">

      <button onclick="login()">로그인</button>

      <div id="userInfo">
        <hr>
        <h2>과제 정보</h2>
        <div id="form-fields"></div>
        <button onclick="update()">정보 저장</button>
      </div>
    </div>

    <script>
      let currentRow = null;
      let userData = {};

      function login() {
        const projectNumber = document.getElementById("projectNumber").value.trim();
        const bizNumber = document.getElementById("bizNumber").value.trim();

        if (!projectNumber || !bizNumber) {
          alert("과제번호와 사업자번호를 입력해주세요.");
          return;
        }

        google.script.run.withSuccessHandler(function (response) {
          if (response.success) {
            currentRow = response.rowIndex;
            userData = response.data;

            const form = document.getElementById("form-fields");
            form.innerHTML = "";

            for (const key in userData) {
              const label = document.createElement("label");
              label.textContent = key;
              const input = document.createElement("input");
              input.id = key;
              input.value = userData[key];
              form.appendChild(label);
              form.appendChild(input);
            }

            document.getElementById("userInfo").style.display = "block";
          } else {
            alert(response.message || "로그인 실패");
          }
        }).loginUser(projectNumber, bizNumber);
      }

      function update() {
        const updated = {};
        for (const key in userData) {
          updated[key] = document.getElementById(key).value;
        }

        google.script.run.withSuccessHandler(function (res) {
          if (res.success) {
            alert("정보가 성공적으로 저장되었습니다.");
          } else {
            alert("수정 실패");
          }
        }).updateUser(currentRow, updated);
      }
    </script>
  </body>
</html>

```

</details>
</br>

GPT가 작성해준 코드를 활용하여 기존 코드의 loginUser, updateUser 함수의 내용을 변경해주고 변경된 HTML을 적용해주었다.

그리고 스프레드 시트의 내용도 이에 맞춰 변경해주었다.

<img src="https://github.com/user-attachments/assets/c37d2b0c-984f-4383-8a72-84cf615439ec" style="width: 700px; height: auto;"/>

수정 사항이 반영되어 정상적으로 기능이 동작하는 것을 확인할 수 있엇다.

<img src="https://github.com/user-attachments/assets/f1ddf1d8-9d26-44a4-b3fa-224f54b3915d" style="width: 600px; height: auto;"/>


</br>
</br>

이후 사용자가 수정할 수 있는 데이터를 제한하고, 데이터 포맷에 맞춰 입력할 수 있도록 한번 더 개선을 진행하였다.

<img src="https://github.com/user-attachments/assets/14017d36-6d02-4e0e-af45-022fd16240c6" style="width: 600px; height: auto;"/>

<img src="https://github.com/user-attachments/assets/d2a55b5b-11eb-4bbc-b025-45ac4437b372" style="width: 600px; height: auto;"/>

</br>

## 최종 결과

<details>
  <summary>코드</summary>
  </br>
  
Code.gs

```
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
```

index.html
```
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        background-color: #f0f2f5;
        padding: 40px;
      }
      .container {
        max-width: 500px;
        margin: auto;
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      h2 {
        text-align: center;
        color: #333;
      }
      label {
        display: block;
        margin-top: 10px;
        font-weight: bold;
        color: #555;
      }
      input {
        width: 100%;
        padding: 10px;
        margin-top: 5px;
        border: 1px solid #ccc;
        border-radius: 6px;
        box-sizing: border-box;
      }
      button {
        width: 100%;
        margin-top: 20px;
        padding: 12px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        cursor: pointer;
      }
      #userInfo {
        display: none;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div style="text-align: center;">
        <h3>사용자 로그인</h3>
      </div>

      <label for="projectNumber">과제번호</label>
      <input type="text" id="projectNumber" placeholder="예 : 12345678">

      <label for="bizNumber">사업자번호</label>
      <input type="text" id="bizNumber" placeholder="예: 123-45-67890">

      <button onclick="login()">로그인</button>

      <div id="userInfo">
        <hr>
        <h2>과제 정보</h2>
        <div id="form-fields"></div>
        <button onclick="update()">정보 저장</button>
      </div>
    </div>

    <script>
      let currentRow = null;
      let userData = {};

      // 표시 순서와 일치하도록 배열로 순서 지정
      const fieldOrder = [
        "연도",
        "과제명",
        "차수",
        "과제 번호",
        "사업자 번호",
        "기업명",
        "대표자명",
        "대표자 휴대폰 번호",
        "대표자 이메일",
        "담당자명(직책)",
        "담당자 휴대폰 번호",
        "담당자 이메일"
      ];

      const readOnlyFields = [
        "연도",
        "과제명",
        "차수",
        "과제 번호",
        "사업자 번호",
        "기업명",
        "대표자명"
      ];


      function login() {
        const projectNumber = document.getElementById("projectNumber").value.trim();
        const bizNumber = document.getElementById("bizNumber").value.trim();

        if (!projectNumber || !bizNumber) {
          alert("과제번호와 사업자번호를 입력해주세요.");
          return;
        }

        google.script.run.withSuccessHandler(function (response) {
          if (response.success) {
            currentRow = response.rowIndex;
            userData = response.data;

            const form = document.getElementById("form-fields");
            form.innerHTML = "";

            fieldOrder.forEach((key) => {
              const label = document.createElement("label");
              label.textContent = key;

              const input = document.createElement("input");
              input.id = key;
              input.value = userData[key] || "";

              // 포맷 안내 텍스트
              const hint = document.createElement("small");
              hint.style.fontSize = "12px";
              hint.style.color = "#888";

              if (readOnlyFields.includes(key)) {
                input.setAttribute("readonly", true);
                input.style.backgroundColor = "#f0f0f0";
              } else {
                // 유효성 포맷 힌트 표시
                if (key.includes("휴대폰")) {
                  hint.textContent = "예: 010-1234-5678";
                } else if (key.includes("이메일")) {
                  hint.textContent = "예: example@example.com";
                }
              }

              form.appendChild(label);
              form.appendChild(input);
              if (hint.textContent) form.appendChild(hint);
            });


            document.getElementById("userInfo").style.display = "block";
          } else {
            alert(response.message || "로그인 실패");
          }
        }).loginUser(projectNumber, bizNumber);
      }

      function update() {
        const updated = {};
        let isValid = true;
        let errorMessage = "";

        const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        fieldOrder.forEach((key) => {
          const value = document.getElementById(key).value.trim();
          updated[key] = value;

          if (!readOnlyFields.includes(key)) {
            if (key.includes("휴대폰") && value && !phoneRegex.test(value)) {
              isValid = false;
              errorMessage = `${key} 형식이 올바르지 않습니다. (예: 010-1234-5678)`;
            }
            if (key.includes("이메일") && value && !emailRegex.test(value)) {
              isValid = false;
              errorMessage = `${key} 형식이 올바르지 않습니다. (예: example@example.com)`;
            }
          }
        });

        if (!isValid) {
          alert(errorMessage);
          return;
        }

        google.script.run.withSuccessHandler(function (res) {
          if (res.success) {
            alert("정보가 성공적으로 저장되었습니다.");
          } else {
            alert("수정 실패");
          }
        }).updateUser(currentRow, updated);
      }

    </script>
  </body>
</html>

```

</details>
</br>
</br>
</br>


### 로그인
<img src="https://github.com/user-attachments/assets/eb625aa9-46d6-4d6a-ac5b-b00b4a8c35b7" style="width: 600px; height: auto;"/>

</br>

### 조회 및 수정
<img src="https://github.com/user-attachments/assets/2c969900-1325-4492-a736-88880d046e4a" style="width: 600px; height: auto;"/>

</br>

### 데이터 수정 시 검증
<img src="https://github.com/user-attachments/assets/92abfe6c-3108-4d3e-a899-6e72edb63869" style="width: 600px; height: auto;"/>
