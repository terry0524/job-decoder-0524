export interface SampleJD {
  id: string;
  label: string;
  companyName: string;
  positionName: string;
  rawContent: string;
}

export const sampleJobDescriptions: SampleJD[] = [
  {
    id: 'data-analyst',
    label: 'Data Analyst',
    companyName: '네이버',
    positionName: '데이터 분석가',
    rawContent: `[담당 업무]
- 대규모 데이터셋 분석을 통한 서비스 개선 인사이트 도출
- Machine Learning 모델 개발 및 A/B Testing을 통한 성과 검증
- Data Pipeline 설계 및 자동화 시스템 구축
- 부서 간 협업을 통한 데이터 기반 의사결정 지원
- 주요 KPI 대시보드 설계 및 성과 보고서 작성

[자격 요건]
- 컴퓨터공학, 통계학, 수학 또는 관련 분야 학사 이상
- Python, SQL 능숙 (필수)
- Statistics 및 Machine Learning 기본 지식
- 데이터 시각화 도구 사용 경험 (Tableau, PowerBI 등)
- 논리적 사고력 및 문제 해결 능력
- 원활한 커뮤니케이션 능력

[우대 사항]
- Deep Learning 또는 NLP 관련 프로젝트 경험
- AWS, GCP 등 Cloud 플랫폼 사용 경험
- A/B Testing 설계 및 분석 경험
- Spark, Hadoop 등 빅데이터 처리 경험
- 스타트업 또는 빠르게 성장하는 환경에서의 근무 경험
- Jupyter Notebook, Git 활용 경험

[근무 조건]
- 정규직
- 서울 강남 오피스
- 유연근무제 적용
- 성장 및 학습 지원 프로그램 제공`,
  },
  {
    id: 'ml-engineer',
    label: 'Machine Learning Engineer',
    companyName: '카카오브레인',
    positionName: 'Machine Learning Engineer',
    rawContent: `[담당 업무]
- 대규모 ML/DL 모델 설계, 학습, 배포 파이프라인 구축
- MLOps 인프라 설계 및 모델 서빙 시스템 운영
- 추천 시스템, 검색 랭킹, NLP 등 핵심 ML 서비스 개발
- 실험 관리 및 A/B 테스트 프레임워크 구축
- 데이터 전처리 및 Feature Engineering 자동화

[자격 요건]
- 컴퓨터공학, AI, 수학/통계 관련 석사 이상 또는 동등 경력
- Python 능숙 (필수), C++ 경험 우대
- PyTorch 또는 TensorFlow 기반 모델 개발 경험 2년 이상
- Docker, Kubernetes 기반 ML 서빙 경험
- SQL 및 대규모 데이터 처리 경험 (Spark, Airflow)
- Git, CI/CD 파이프라인 활용 경험

[우대 사항]
- Transformer, LLM, Diffusion Model 관련 연구/개발 경험
- NVIDIA GPU 클러스터 또는 TPU 활용 경험
- MLflow, Kubeflow, Ray 등 MLOps 도구 사용 경험
- AWS SageMaker, GCP Vertex AI 등 클라우드 ML 플랫폼 경험
- 논문 게재 또는 오픈소스 기여 경험
- Triton Inference Server, TensorRT 최적화 경험

[근무 조건]
- 정규직
- 판교 오피스 (하이브리드 근무)
- GPU 서버 및 연구 장비 지원
- 학회 참석 및 논문 발표 지원`,
  },
  {
    id: 'mechanical-engineer',
    label: 'Mechanical Design Engineer',
    companyName: '현대로보틱스',
    positionName: 'Mechanical Design Engineer',
    rawContent: `[담당 업무]
- 산업용 로봇 및 자동화 장비의 기구 설계
- 3D CAD를 활용한 부품 및 어셈블리 모델링
- 유한요소해석(FEA)을 통한 구조 강도 및 피로 해석
- GD&T 기반 도면 작성 및 공차 분석
- 프로토타입 제작 및 시험 평가 (진동, 열, 충격)
- 협력사 관리 및 양산 이관 지원

[자격 요건]
- 기계공학 또는 관련 분야 학사 이상
- SolidWorks 또는 CATIA 능숙 (필수)
- ANSYS, Abaqus 등 FEA 해석 경험
- GD&T (기하공차) 도면 작성 능력
- DFM/DFA (제조 및 조립 용이성 설계) 이해
- 재료역학, 열역학, 유체역학 기본 지식
- 기계 가공 (CNC, 사출, 판금) 프로세스 이해

[우대 사항]
- 로봇 또는 자동화 장비 설계 경험
- MATLAB, Python을 활용한 엔지니어링 시뮬레이션 경험
- PCB 하우징 및 전장 부품 설계 경험
- ISO 9001, CE 인증 관련 경험
- 6축 로봇 또는 협동 로봇 관련 지식
- PDM/PLM 시스템 (Windchill, Teamcenter) 사용 경험

[근무 조건]
- 정규직
- 대전 본사 R&D 센터
- 시제품 실험실 및 3D 프린터 지원
- 해외 전시회 참가 기회 제공`,
  },
];

// Backward compatibility
export const sampleJobDescription = sampleJobDescriptions[0];
