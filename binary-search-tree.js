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

  insert(value, root = this.root) {
    if (value === root.data) return null;

    const newNode = new Node(value);

    if (value < root.data) {
      if (root.left) {
        this.insert(value, root.left);
      } else {
        root.left = newNode;
      }
    } else if (value > root.data) {
      if (root.right) {
        this.insert(value, root.right);
      } else {
        root.right = newNode;
      }
    }
  }

  deleteItem(value) {
    const target = this.find(value);
    const targetParent = this.findParent(value);

    if (!value || !target) return null;

    // If the deleted node is a leaf
    // That node is now null
    if (!target.left && !target.right) {
      if (targetParent.left === target) targetParent.left = null;
      if (targetParent.right === target) targetParent.right = null;
      return;
    }

    // If the deleted node only has one child
    // The node is replaced by that child
    if (target.left && !target.right) {
      if (targetParent.left === target) targetParent.left = target.left;
      if (targetParent.right === target) targetParent.right = target.left;
      return;
    } else if (!target.left && target.right) {
      if (targetParent.left === target) targetParent.left = target.right;
      if (targetParent.right === target) targetParent.right = target.right;
      return;
    }

    // If the deleted node has two children
    // We find a replacement - the next higher number
    let replacement = target.right;
    while (replacement.left) {
      replacement = replacement.left;
    }

    // Delete the replacement
    this.deleteItem(replacement.data);

    // Make the value of the deleted node the same as the deleted replacement
    target.data = replacement.data;
  }

  find(value, root = this.root) {
    if (value === root.data) return root;
    if (value < root.data)
      return root.left ? this.find(value, root.left) : null;
    if (value > root.data)
      return root.right ? this.find(value, root.right) : null;
  }

  findParent(value, root = this.root) {
    if (
      (root.left && root.left.data === value) ||
      (root.right && root.right.data === value)
    )
      return root;
    if (value < root.data)
      return root.left ? this.findParent(value, root.left) : null;
    if (value > root.data)
      return root.right ? this.findParent(value, root.right) : null;
  }

  levelOrder(callback) {
    if (!callback) throw new Error('Callback function needed');

    const queue = [this.root];

    while (queue.length > 0) {
      const item = queue[0];
      if (item.left) queue.push(item.left);
      if (item.right) queue.push(item.right);
      callback(queue.shift().data);
    }
  }

  inOrder(callback, root = this.root) {
    if (!callback) throw new Error('Callback function needed');

    if (root.left) this.inOrder(callback, root.left);
    callback(root.data);
    if (root.right) this.inOrder(callback, root.right);
    return;
  }

  preOrder(callback, root = this.root) {
    if (!callback) throw new Error('Callback function needed');

    callback(root.data);
    if (root.left) this.preOrder(callback, root.left);
    if (root.right) this.preOrder(callback, root.right);
    return;
  }

  postOrder(callback, root = this.root) {
    if (!callback) throw new Error('Callback function needed');

    if (root.left) this.postOrder(callback, root.left);
    if (root.right) this.postOrder(callback, root.right);
    callback(root.data);
    return;
  }

  height(value) {
    const target = typeof value === 'object' ? value : this.find(value);
    let counter = 0;

    if (!target) return;
    if (!target.left && !target.right) return counter;

    const leftCounter = target.left ? this.height(target.left.data) : 0;
    const rightCounter = target.right ? this.height(target.right.data) : 0;

    counter += leftCounter > rightCounter ? leftCounter : rightCounter;

    return counter + 1;
  }

  depth(value) {
    let target = value;
    let counter = 0;

    while (this.findParent(target)) {
      counter++;
      target = this.findParent(target).data;
    }

    return counter;
  }
}
