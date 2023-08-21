class Heap {
  constructor() {
    this.heap = [];
  }

  getLength() {
    return this.heap.length;
  }

  swap(i1, i2) {
    [this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]];
  }

  heappush(node) {
    this.heap.push(node);
    let index = this.heap.length - 1;
    let parentIndex = parseInt((index - 1) / 2);
    while (
      this.heap[parentIndex] &&
      this.heap[parentIndex].expected_time > this.heap[index].expected_time
    ) {
      this.swap(parentIndex, index);
      index = parentIndex;
      parentIndex = parseInt((index - 1) / 2);
    }
  }

  heappop() {
    if (this.heap.length === 1) {
      return this.heap.pop();
    } else {
      let result = this.heap[0];
      this.heap[0] = this.heap.pop();
      let currIndex = 0;
      let leftIndex = 2 * currIndex + 1;
      let rightIndex = 2 * currIndex + 2;

      while (
        (this.heap[leftIndex] &&
          this.heap[leftIndex].expected_time <
            this.heap[currIndex].expected_time) ||
        (this.heap[rightIndex] &&
          this.heap[rightIndex].expected_time <
            this.heap[currIndex].expected_time)
      ) {
        let nextIndex = leftIndex;
        if (
          this.heap[rightIndex] &&
          this.heap[rightIndex].expected_time < this.heap[leftIndex]
        ) {
          nextIndex = rightIndex;
        }
        this.swap(currIndex, nextIndex);
        currIndex = nextIndex;
        leftIndex = 2 * currIndex + 1;
        rightIndex = 2 * currIndex + 2;
      }
      return result;
    }
  }
}

module.exports = { Heap };
