import mergeSort from './merge-sort.js';

class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

export default class Tree {
  constructor(arr) {
    this.root = this.buildTree(this.sort(arr));
  }

  sort(arr) {
    // remove duplicates
    const result = [];

    arr.forEach((elm) => {
      if (result.includes(elm)) return;
      result.push(elm);
    });

    return mergeSort(result);
  }

  buildTree(arr, start = 0, end = arr.length - 1) {
    if (start > end) return null;
    const midIndex = Math.floor((end + start) / 2);

    const root = new Node(arr[midIndex]);

    root.left = this.buildTree(arr, start, midIndex - 1);
    root.right = this.buildTree(arr, midIndex + 1, end);

    return root;
  }
}
