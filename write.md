# Underscore.js 로 학습하기
프로젝트 설명 : Underscore.js에 나오는 함수 만들어본다. 일단 Arrays 함수부터 만들어본다.   
### Underscore란 무엇인가 ?

---
# :key: 해결 과정 
## _.initial(array, [n]) 
### :speech_balloon: 함수 설명
배열의 마지막을 제외하고 다른 모든 것을 리턴한다. 특히 arguments 객체에 유용하다. 결과로부터 마지막 n 요소를 차단하기 위해 n 을 통과시켜라.  
Returns everything but the last entry of the array. Especially useful on the arguments object. Pass n to exclude the last n elements from the result.

### 문제 파악 
* n이 없으면 마지막을 제외하고 리턴한다.
* 여기서 n은 옵션이다. n을 넣으면 마지막으로부터 n개를 제외시키고 리턴한다.     
* n이 배열의 길이보다 길면(n > length) 빈 배열을 반환한다. 

### test code
undersocre.js에서 지원하는 testcode를 모두 만족해야한다. 
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
### 함수 작성 
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

### 코드 설명 
* 빈 배열을 생성해서 변수에 저장한다. 
* 만약 n이 `undefined` 이면 배열 길이에서 n 을 뺀 길이 조건 만큼 루프를 돌게 한다. 
* n 이 undefined가 아니라면  
  * pop()은 배열의 제일 마지막 요소를 제거한다. 
  * array 요소를 반환한다. 

#### 관련 링크 
* pop()   
* push()  
* for Loop()  

## _.initial(array, [n]) 
### :speech_balloon: 함수 설명
배열의 마지막을 제외하고 다른 모든 것을 리턴한다. 특 arguments 객체에 유용하다. 결과로부터 마지막 n 요소를 차단하기 위해 n 을 통과시켜라.  
Returns everything but the last entry of the array. Especially useful on the arguments object. Pass n to exclude the last n elements from the result.





