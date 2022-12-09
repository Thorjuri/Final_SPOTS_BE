


<!--
목차
1. **프로젝트 안내**
    1. 주제 선정 배경
    2. 팀 구성
    3. 스택
2. **서비스 안내**
    1. 링크
    2. 서비스 소개 및 캐치프라이즈
    3. 주요 기능 소개
    4. 화면 안내
3. **개발 및 소스 안내**
    1. 서비스 아키텍쳐
    2. 의존성 / 패키지 
    3. 폴더구조 및 기능단위 소개
    4. 개발 팀 노션
-->


# 슬기로운 운동 생활 no1 플랫폼, SPOTS🥎 
![new_spots_main-02 - 복사본](https://user-images.githubusercontent.com/112181770/203546357-f077ac8c-a67a-427a-bb5a-6561483eea3b.jpg)
# 📢Chapter 1. Introduction
### ✔ Project SPOTS!
- 총 7인의 예비 개발자 및 디자이너가 협업하여 웹 서비스를 제작하는 6주간의 프로젝트입니다.
- 설계부터 개발, 디자인, 배포, 유저테스트와 업데이트까지- 온전한 하나의 서비스를 위한 개발 플로우를 경험합니다.
- GitHub, Notion 등 프로젝트 관리 툴을 적극 활용하며, 실무와 유사한 협업 프로세스를 지향합니다.
- 기술적 의사결정 과정을 통해 보다 효율적인 로직을 고민하고, 적극적인 트러블 슈팅을 통해 견고한 개발자로 거듭나고 있습니다.
### ✔ Period : 2022. 11. 4 ~ 22. 12. 16 (6주)
### ✔ Team SPOTS!　
#### 　　 ▪ 3 Backend 👤👤👤 
#### 　　 ▪ 3 Frontend 👤👤👤
#### 　　 ▪ 1 Designer 👤
### ✔ Stacks?
<div>
  <h4>　 ▪ Backend </h4>
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black">
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=black">
<img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=Express&logoColor=white">
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">
<img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white">
<img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=Socket.io&logoColor=white">
<img src="https://img.shields.io/badge/Amazon EC2-FF9900?style=for-the-badge&logo=Amazon EC2&logoColor=white">
<img src="https://img.shields.io/badge/Amazon S3-569A31?style=for-the-badge&logo=Amazon S3&logoColor=white">
<img src="https://img.shields.io/badge/GitHub Actions-4479A1?style=for-the-badge&logo=GitHub Actions&logoColor=white">
<img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=Jest&logoColor=white">

 <h4> 　▪ Frontend </h4>
 <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black">
 <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white">
 <img src="https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=Redux&logoColor=white">
 <img src="https://img.shields.io/badge/styled-components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white">
 <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white">
 <img src="https://img.shields.io/badge/React Hook Form-EC5990?style=for-the-badge&logo=React-Hook-Form&logoColor=white">
 <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=Vercel&logoColor=white">
 <img src="https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=PWA&logoColor=white">
</div>

<br>

# 📢Chapter 2. Service
### 🌐1. What's 'SPOTS' ? 
 - 각 지역의 공공/사설 스포츠 시설 조회 및 시설 예약, 경기 매칭 등의 서비스를 제공하는 생활 체육 플랫폼입니다. 
 - SPOTS(스팟츠)는 위치를 의미하는 스팟(SPOT), 스포츠(SPORTS)에서 유래했습니다.
 - 지역/종목 별 시설을 지도 기반의 view를 통해 쉽게 조회하고, 희망하는 시설/에 경기 매칭 예약을 신청할 수 있습니다.
 - 주 기능은 위치 및 시설 정보를 제공하는 '조회' 서비스, 그리고 시설 및 상대팀을 매칭하는 '예약' 서비스로 나뉘어집니다.
 ![003](https://user-images.githubusercontent.com/112181770/203514223-618c170d-3265-4cf2-b01b-a16851403e70.png)

<br>

## 🌐2. Main features 
![004](https://user-images.githubusercontent.com/112181770/203514266-3362b68f-2e83-439e-ae01-fe8a9b5df70c.png)
### (1) 스팟 조회
  - kakao maps 지도 기반의 직관적인 스팟 위치 안내
  - openAPI를 이용한 서울시 실시간 공공 체육 시설 조회
  - 수도권 내 사설 체육 시설의 위치와 상세정보 조회
  - 지역/종목 별 스팟 통합 검색
### (2) 스팟 예약 / 매칭 예약
  - 희망하는 날짜에 스팟 이용 예약
  - 희망하는 스팟/날짜에 경기 매칭 신청 (팀 매칭)
  - 포인트 결제 시스템
  - 매칭 내역 메일링 서비스
### (3) 기타 고객서비스
  - 회원 및 팀 단위의 등록과 이용
  - 자체 회원가입/로그인 및 카카오 소셜 로그인 기능
  - 관리자와의 1:1 채팅을 통한 CS 서비스

<br>

 ## 🌐3. Site Map
 - (준비중)

<br>

# 📢Chapter 3. Development Source<br>

### 🌐1. Service Architecture

![008](https://user-images.githubusercontent.com/112181770/203515473-1ac0b9dc-1ebe-482e-a193-96ba292a5856.png)
<br>

## 🌐2. Dev-Process

![006](https://user-images.githubusercontent.com/112181770/203515275-0d00686e-6a47-4450-b8dd-c86a4979f786.png)
<br>

## 🌐3. Functional Unit

![007](https://user-images.githubusercontent.com/112181770/203515350-215d40c5-abf3-4862-8feb-8e4f5cff62e8.png)
<br>

## 🌐4. Dependency
- (준비중)
<br>

## 🌐5. Directory Structure
- (준비중)
<br>


<!-- 하단 로고-->
![spots_main-02_대지 1](https://user-images.githubusercontent.com/112181770/203052929-79cdb020-e24c-40ad-8963-1e0886693441.png)

 
