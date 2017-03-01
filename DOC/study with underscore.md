# Underscore.js로 자바스크립트 공부하기 

저의 프로젝트는 underscore.js 에 나오는 Method들을 제가 직접 구현하는 것입니다. 현재 진행 단계이며 2–3주간의 과정에서 느꼈던 경험을 공유하고자 합니다.  

### Underscore는 무엇인가? 

![underscore](https://github.com/kowumon/underskowu/blob/master/DOC/img/underimg.png)   
                   

Underscore.js는 자바스크립트 언어 기반의 라이브러리입니다. Jeremy Ashkenas 이 만들었고 코딩 할 때 유용하게 쓸 수 있는 80개나 넘는 함수들을 제공합니다. 언더스코어 함수 중에는 현재  브라우저에 내장되어있는 함수와 같은 기능을 하는 함수가 많습니다. 더 업그레이드 된 버전으로 Lodash가 있습니다. 더 자세한 설명은 http://underscorejs.org/ 에서 참고하시길 바랍니다. 


### 프로젝트 시작

프로그래밍을 하면서 제일 어려웠던 점은 생각한 것을 코드로 나타내는 것이었습니다. 컴퓨터는 상세하게 설명해줘야 알아듣습니다. 아주 작게 나눠서 생각하는 것이 어려웠고 저 자체가 논리적인 사고를 하는 것을 어려워했습니다. 좀 더 기초를 쌓아야 겠다는 생각이 들었고, 추천을 통해서 언더스코어 프로젝트를 시작하게 되었습니다. 

##  프로젝트 과정  

처음에는 언더스코어를 처음부터 읽으면서 이해해보고자 하였습니다. 하지만 제가 모르는 부분이 많았습니다. 재귀, 클로저 등.. 알아야 할 것이 많았기에 일단 나중에 하기로 하고 언더스코어에서 제공하는 테스트코드에 모두 만족하는 함수를 만들어 보기로 목표를 잡았습니다.  

### test code를 모두 만족시켜라  

어떤 작업이나 프로젝트를 할 때 의도치 못한 상황이 발생할 수 있고, 길을 잃을 수 도 있습니다. 테스트 프레임워크를 사용하여(Qunit이나 [Jasmine.js](https://jasmine.github.io/), [Mocha.js](https://mochajs.org/) 등)  자신의 작업물이나 프로젝트를 테스트 할 수 있습니다. 예외를 방지 할 수 있습니다. 

언더스코어는 [QUnit](http://qunitjs.com/) 테스트 프레임 워크를 이용합니다.

 ![quint](https://github.com/kowumon/underskowu/blob/master/DOC/img/qunit.png)

내가 짠 함수 코드가 테스트 코드에 얼만큼 맞는지, 그리고 어디가 틀렸는지를 가르쳐 주고 시간도 확인 할 수 있습니다.  통과하면 초록색이 뜰 것이고, 틀리면 내용과 함께 빨간색으로 처리됩니다.

### 만들어 본  함수 짧게 소개

 저는 일단 Array Functions 부터 만들어 보았습니다. 언더스코어 홈페이지에 보면 각 함수에 대한 예제와 함께 간략하게 설명해 놓았습니다. 만들어야 할 함수가 어떤 함수인지 알 수 있습니다. 

### _.initial(array, [n])

#### :checkered_flag: 함수 설명  

배열의 마지막 요소을 제외하고 다른 모든 것을 리턴해야 합니다. 특히 arguments 객체에 유용합니다. 결과로부터 마지막 n 요소를 차단하기 위해 n 을 통과시켜야 합니다.

Returns everything but the last entry of the array. Especially useful on the arguments object. Pass n to exclude the last n elements from the result.

#### :white_check_mark: test code

```javascript
QUnit.test('initial', function(assert) {
    assert.deepEqual(_.initial([1, 2, 3, 4, 5]), [1, 2, 3, 4], 'returns all but the last element');
    assert.deepEqual(_.initial([1, 2, 3, 4], 2), [1, 2], 'returns all but the last n elements');
    assert.deepEqual(_.initial([1, 2, 3, 4], 6), [], 'returns an empty array when n > length');
    var result = (function(){ return _(arguments).initial(); }(1, 2, 3, 4));
    assert.deepEqual(result, [1, 2, 3], 'works on an arguments object');
    result = _.map([[1, 2, 3], [1, 2, 3]], _.initial);
    assert.deepEqual(_.flatten(result), [1, 2, 1, 2], 'works well with _.map');
  });
```

- n (두번째 인자)이 없으면 마지막을 제외하고 리턴합니다.
- 여기서 n은 옵션입니다. n을 넣으면 마지막으로부터 n개를 제외시키고 리턴합니다.
- n이 배열의 길이보다 길면(n > length) 빈 배열을 반환합니다.

#### 함수 작성:gun: 

```javascript
_.initial = function initial(array, n) {
    var result = [];
    if (n !== undefined) {
      for (var i = 0; i < array.length - n; i++) {
        result.push(array[i]);
      }
    } else {
      array.pop();
      return array;
    }
    return result;
  };
```

#### 코드 설명

- 빈 배열을 생성해서 변수에 저장합니다.
- 만약 n이 `undefined` 이면 배열 길이에서 n 을 뺀 길이 조건 만큼 루프를 돕니다.
- n 이 `undefined`가 아니라면
  - pop()은 배열의 제일 마지막 요소를 제거합니다.
  - array 요소를 반환합니다.

    ​

## 느낀 점

### 깊게 공부할 수 있습니다.

언더스코어 라이브러리는 작은 단위의 함수들이 많습니다. 현재 브라우저에 내장되어 있는 `Array.prototype.forEach()` , `Array.prototype.reduce()` 등 같은 기능을 하는 함수가 많습니다. 어떻게 동작하는 지 깊게 살펴 볼 수 있는 계기가 된 것 같습니다.  한 개의 함수를 만들 때마다 테스트 코드를 모두 만족하는 함수를 만들어야 하니 책을 찾아보거나 여러 방법을 생각해야 해서 프로그래밍 공부하는 데 도움이 많이 되는 것 같습니다. 

###  재밌습니다.

예제만 보고 함수를 만든 적이 있었습니다. 테스트 코드는 나중에 봤는데, test-suit를 열어보니 1개만 틀리고 6개 모두 만족하는 함수를 만들었었습니다. 굉장히 기뻤습니다. 제대로 만들었는지 결과를 바로 확인 할 수 있어서 도전의식도 생기고 재밌었습니다. 

### 글을 마치며..

아직 언더스코어를 정확하게 이해하지 못했습니다. 장기적인 프로젝트가 될 것 같습니다. [ [underscore-docs]]( http://underscorejs.org/docs/underscore.html) 을 읽으면서 정리도 하면서 하나씩 함수를 만들 예정입니다. 

글을 읽어주셔서 감사합니다. 



 

 

 

 

 

 

 

 

 

 

 

 

 