import _ from 'lodash';

const world = 'world~';

export function hello(word: string = world): string {
  return _.upperCase(`Hello ${word}!`);
}

export function addSomething(text: string = ``): string {
  return text + ` and Something!`;
}
