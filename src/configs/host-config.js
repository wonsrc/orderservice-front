// 브라우저에서 현재 클라이언트에 호스트 이름을 얻어오기
const clientHostName = window.location.hostname;

let backendHostName; // 백엔드 서버 호스트 이름

/*
 리액트 프로젝트의 개발 중 ip는 localhost 입니다. -> 백엔드도 localhost로 작업 중일 것이다.
 하지만, 나중에는 서비스를 위해 도메인을 구입할 것입니다. -> 백엔드의 주소도 달라질 수 있다.
 리액트 내에서 백엔드를 지목하면서 fetch(axios) 요청을 많이 진행하고 있음.
 주소가 변경되었을 경우 일일히 모든 컴포넌트의 주소를 변경하기가 번거롭기 때문에
 호스트 네임을 전역적으로 관리하려는 의도로 설정하는 파일.
*/

if (clientHostName === 'locakhost') {
  // 개발 중
  backendHostName = 'http://locathost:8181';
} else if (clientHostName === 'playdatashop92.shop') {
  // 배포해서 현재 서비스 중
  backendHostName = 'http://3.36.13.24:8000';
}

export const API_BASE_URL = backendHostName;
export const USER = '/user-service';
export const ORDER = '/ordering-service';
export const PROD = '/product-service';
