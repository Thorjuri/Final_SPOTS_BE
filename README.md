


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
![KakaoTalk_20221223_195606683](https://user-images.githubusercontent.com/112181770/209793668-6eaaf4cb-a1b3-40b9-9c9b-1698643c0198.png)


# 슬기로운 운동 생활 no1 플랫폼, SPOTS🥎 
![new_spots_main-02 - 복사본](https://user-images.githubusercontent.com/112181770/203546357-f077ac8c-a67a-427a-bb5a-6561483eea3b.jpg)
![1 intro](https://user-images.githubusercontent.com/112181770/206945650-57ffe539-f6e8-4e4b-bd2c-d8518e314841.png)
![001](https://user-images.githubusercontent.com/112181770/206945353-f021f895-f7ca-4017-adba-b6f1e485981c.png)
![durations](https://user-images.githubusercontent.com/112181770/206945542-1b919a9e-8ddb-42bb-b825-a8ec01f90e3e.png)
<br>

![003](https://user-images.githubusercontent.com/112181770/206945390-c3c50b98-5d67-4422-a7a4-9fef18ec0cf2.png)<br>
<br>
<br>
![004](https://user-images.githubusercontent.com/112181770/206945397-a42c1a3a-b4de-41e6-a1db-141a1b131028.png)<br>
<br>

![2 service](https://user-images.githubusercontent.com/112181770/206945675-4b6f417f-859a-4866-b66e-f4d5e2d38cc0.png)<br>
![whats spots](https://user-images.githubusercontent.com/112181770/206988463-95fc9551-074d-4053-97f0-9023732bbe4f.png)<br>

 - 각 지역의 공공/사설 스포츠 시설 조회 및 시설 예약, 경기 매칭 등의 서비스를 제공하는 생활 체육 플랫폼입니다. 
 - SPOTS(스팟츠)는 위치를 의미하는 스팟(SPOT), 스포츠(SPORTS)에서 유래했습니다.
 - 지역/종목 별 시설을 지도 기반의 view를 통해 쉽게 조회하고, 희망하는 시설/에 경기 매칭 예약을 신청할 수 있습니다.
 - 주 기능은 위치 및 시설 정보를 제공하는 '조회' 서비스, 그리고 시설 및 상대팀을 매칭하는 '예약' 서비스로 나뉘어집니다.
<br>

![서비스소개](https://user-images.githubusercontent.com/112181770/206988578-c0939f52-a920-462a-8f38-16152745d1cc.png)<br>

<br>
<hr>
<br>

![main feat](https://user-images.githubusercontent.com/112181770/206945762-24057680-a499-481d-a0c8-b2ba238c051c.png)<br>

![004](https://user-images.githubusercontent.com/112181770/203514266-3362b68f-2e83-439e-ae01-fe8a9b5df70c.png)<br>

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
<hr>
<br>

![site map](https://user-images.githubusercontent.com/112181770/206945783-e6a15ff9-da03-4fdb-a306-3c76ac19432b.png)<br>

![화면-캡쳐-001](https://user-images.githubusercontent.com/112181770/207041456-004386df-29bf-4490-b775-0a3d0c4114bf.png)<br>

![화면-캡쳐-002](https://user-images.githubusercontent.com/112181770/207041483-175994ef-28ae-48c4-95df-06c11012c805.png)

<br>
<hr>
<br>

![3 development](https://user-images.githubusercontent.com/112181770/206945793-fc226885-76ea-4c97-bebb-bca8c6dc8c91.png)<br>

![architecture](https://user-images.githubusercontent.com/112181770/206945803-a24d0d14-6d0b-4283-b2a6-304ddd031f38.png)<br>

![서비스-아키테쳐-최종(인덱스삭제)](https://user-images.githubusercontent.com/112181770/206987800-fe6a94d4-d5f7-4a3e-9ef4-da956dc73db4.png)

<hr>

![func unit](https://user-images.githubusercontent.com/112181770/206945871-24e36ed8-9f6f-478e-924e-139554837b6f.png)

![_최종_SPOTS-중간-발표-자료-007](https://user-images.githubusercontent.com/112181770/207047429-29cb3d99-1f0b-42b5-ad5e-8287d35e8192.png)


<hr>
<br>

![dependency](https://user-images.githubusercontent.com/112181770/206945884-3cf6a2f5-2a30-4751-92f6-1b529b3243b6.png)<br>

![dependency](https://user-images.githubusercontent.com/112181770/207027229-3bb98bb3-6bc1-4a51-b8c2-24c9a3c7d1e5.png)


<br>
<hr>
<br>

![dir sturcture](https://user-images.githubusercontent.com/112181770/206945893-dc70b918-31ed-40b6-87bc-97aac849ec78.png)<br>

![Directory-structure-001](https://user-images.githubusercontent.com/112181770/207044730-b049961b-86b4-4e51-b089-a7b63cd2efc3.png)



<br>
<hr>
<br>

![PM](https://user-images.githubusercontent.com/112181770/206985626-04093f28-8728-4e7d-ae49-b777acf89bbf.png)<br>

![006](https://user-images.githubusercontent.com/112181770/203515275-0d00686e-6a47-4450-b8dd-c86a4979f786.png)<br>

<br>
<hr>
<br>

![job process](https://user-images.githubusercontent.com/112181770/206945850-52845009-7fc1-4961-b02d-d424c8e90136.png)<br>

![워크플로우-ver2 0](https://user-images.githubusercontent.com/112181770/206985040-c122f30f-375d-4a7c-ab9d-132a5a3a0324.png)<br>






<!-- 하단 로고-->


 
