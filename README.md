# 배치 작업 스케줄러

2023.08.06 ~ 2023.08.28

10.16 ~ : Typescript를 공부하여 migrate 준비중

## Stacks

- React.js
- Express.js
- MySQL

## 전체 화면

<img width="1434" alt="image" src="https://github.com/htogether7/batch_scheduler/assets/99343081/8fa04f7f-9d20-4629-8e6c-bf341599f3f5">

## 주요 기능

### <a href="https://github.com/htogether7/batch_scheduler/blob/f6568d1dc98f022f9bc8d190dde1f4100cb336b7/description.pdf">상세 설명(pdf)</a>

### 스케줄링

- 스케줄러는 일정 주기마다 그 순간 실행될 수 있는 작업들을 실행합니다. 요구사항 중 하나로 어떤 작업의 실행 여부를 조건으로 하는 작업의 경우도 고려하여 실행해야 한다는 조건이 있었습니다. 예를 들면, '작업 A가 끝나고 난 후에 실행되는 작업 B가 존재한다'와 같습니다.

- 처음에는 어떤 작업을 선행 조건으로 하는 작업을 다음 배치 구간에 실행시키면 쉽게 구현할 수 있다고 생각했습니다. 하지만 배치 구간의 간격이 길어지면, 선행 조건이 완료되더라도 실행이 안되고 대기해야하는 시간이 너무 길다는 문제가 있었습니다.

- 이를 해결하기 위해 어떤 작업의 실행 완료가 조건인 작업의 선행 조건들이 모두 만족하면 그 즉시, 실행가능하다고 판단하여 작업 큐에 넣는 방식으로 구현했습니다.

- 이렇게 했을 때, 작업의 조건에 따른 실행 방식이 달랐기 때문에 우선 순위를 두어야 했습니다. 이때, 예상 실행 시간을 key로 하는 heap을 활용하여 스케줄링하여, 작업들의 평균 대기 시간을 줄였습니다.

### 작업 등록, 수정, 삭제

<img width="451" alt="image" src="https://github.com/htogether7/batch_scheduler/assets/99343081/b1fdd1f7-3e68-41ac-ba20-e9d1e6f3b506">

작업 등록 Form을 통해서 작업을 등록할 수 있습니다. 작업 수정 시에도 같은 Form을 사용합니다.

<img width="845" alt="image" src="https://github.com/htogether7/batch_scheduler/assets/99343081/f266239c-96e1-40e9-a53b-4b60cf6d235b">

리스트를 통해 등록된 작업들을 확인할 수 있습니다. 또한 수정과 삭제가 가능합니다.

### 작업 흐름도

<img width="451" alt="image" src="https://github.com/htogether7/batch_scheduler/assets/99343081/c0ee1225-f832-41a7-8d54-d5bdae91766a">

작업\_1이 끝나면, 작업\_2가 실행되고, 작업\_2가 끝나면, 작업\_3,4,5,6이 실행된다는 것을 보여주는 작업 흐름도입니다.

### 작업 로그

<img width="451" alt="image" src="https://github.com/htogether7/batch_scheduler/assets/99343081/88d27328-fb07-4c4a-bf8b-613b83bf45ef">

작업 로그를 통해서 사용자는 실제로 작업이 어떻게 실행되고 있는지를 확인할 수 있습니다.
