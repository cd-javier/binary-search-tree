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
    if (!arr || arr.length === 0) return [];
    // remove duplicates
    const result = [];

    arr.forEach((elm) => {
      if (result.includes(elm)) return;
      result.push(elm);
    });

    return mergeSort(result);
  }

  buildTree(arr, start = 0, end = arr.length - 1) {
    if (!arr || arr.length === 0) return null;
    if (start > end) return null;
    const midIndex = Math.floor((end + start) / 2);

    const root = new Node(arr[midIndex]);

    root.left = this.buildTree(arr, start, midIndex - 1);
    root.right = this.buildTree(arr, midIndex + 1, end);

    return root;
  }

  prettyPrint(node = this.root, prefix = '', isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? '│   ' : '    '}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
  }

  insert(value, root = this.root) {
    // If no value is provided
    if (value === null || value === undefined) {
      throw new Error('Cannot insert null or undefined into the tree');
    }

    const newNode = new Node(value);

    // If the tree is empty
    if (this.root === null) {
      this.root = newNode;
      return true;
    }

    // If the value already exists in the tree
    if (value === root.data) {
      return false;
    }

    // Recursive method for inserting the value into the tree
    if (value < root.data) {
      if (root.left) {
        this.insert(value, root.left);
      } else {
        root.left = newNode;
        return true;
      }
    } else {
      if (root.right) {
        this.insert(value, root.right);
      } else {
        root.right = newNode;
        return true;
      }
    }
  }

  deleteItem(value) {
    const target = this.find(value);
    const targetParent = this.findParent(value);

    if (!target) return false;

    // Helper function
    const replaceNodeInParent = (parent, oldNode, newNode) => {
      if (parent) {
        if (parent.left === oldNode) parent.left = newNode;
        else if (parent.right === oldNode) parent.right = newNode;
      } else {
        this.root = newNode;
      }
    };

    // Case 1: The deleted node is a leaf
    if (!target.left && !target.right) {
      // That node is now null
      replaceNodeInParent(targetParent, target, null);
      return true;
    }

    // Case 2: The deleted node only has one child
    // The node is replaced by that child
    if (target.left && !target.right) {
      replaceNodeInParent(targetParent, target, target.left);
      return true;
    } else if (!target.left && target.right) {
      replaceNodeInParent(targetParent, target, target.right);
      return true;
    }

    // Case 3: The deleted node has two children
    let replacement = target.right;
    // Find the in-order successor
    while (replacement.left) {
      replacement = replacement.left;
    }
    // Delete the replacement
    this.deleteItem(replacement.data);
    // Make the value of the deleted node the same as the deleted replacement
    target.data = replacement.data;
    return true;
  }

  find(value, root = this.root) {
    if (!root) return null;
    if (value === root.data) return root;
    if (value < root.data)
      return root.left ? this.find(value, root.left) : null;
    if (value > root.data)
      return root.right ? this.find(value, root.right) : null;
  }

  findParent(value, root = this.root) {
    if (!root) return null;
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
    if (!this.root) return;

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
    if (!this.root) return;

    if (root.left) this.inOrder(callback, root.left);
    callback(root.data);
    if (root.right) this.inOrder(callback, root.right);
    return;
  }

  preOrder(callback, root = this.root) {
    if (!callback) throw new Error('Callback function needed');
    if (!this.root) return;

    callback(root.data);
    if (root.left) this.preOrder(callback, root.left);
    if (root.right) this.preOrder(callback, root.right);
    return;
  }

  postOrder(callback, root = this.root) {
    if (!callback) throw new Error('Callback function needed');
    if (!this.root) return;

    if (root.left) this.postOrder(callback, root.left);
    if (root.right) this.postOrder(callback, root.right);
    callback(root.data);
    return;
  }

  height(value) {
    const target = typeof value === 'object' ? value : this.find(value);

    if (!target) return null;
    if (!target.left && !target.right) return 0;

    const leftCounter = target.left ? this.height(target.left.data) : 0;
    const rightCounter = target.right ? this.height(target.right.data) : 0;

    return Math.max(leftCounter, rightCounter) + 1;
  }

  depth(value) {
    if (!this.find(value)) return null;
    let target = value;
    let counter = 0;

    while (this.findParent(target)) {
      counter++;
      target = this.findParent(target).data;
    }

    return counter;
  }

  isBalanced() {
    const difference =
      this.height(this.root.left) - this.height(this.root.right);

    console.log(difference);

    return difference <= 1 && difference >= -1;
  }

  rebalance() {
    const arr = [];
    this.inOrder((elm) => arr.push(elm));

    this.root = this.buildTree(arr);
  }
}
