import Coderr, { wrap } from "@robotmayo/coderr";
export interface Option<T> {
  isSome(): boolean;
  isNone(): boolean;
  unwrap(): T;
  unwrapOr(d: T): T;
  unwrapOrElse(f: () => T): T;
  map<U>(fn: (i: T) => U): Option<U>;
  mapOr<U>(d: U, fn: (i: T) => U): U;
  okOr<E>(err: E): Result<T, E>;
  okOrElse<E>(err: () => E): Result<T, E>;
  and<U>(d: Option<U>): Option<U>;
  andThen<U>(fn: (i: T) => Option<U>): Option<U>;
  orElse(fn: () => Option<T>): Option<T>;
}

export class Some<T> implements Option<T> {
  private val: T;
  constructor(v: T) {
    this.val = v;
  }
  isSome() {
    return true;
  }
  isNone() {
    return false;
  }
  unwrap(): T {
    return this.val;
  }
  unwrapOr(d: T): T {
    return this.val;
  }
  unwrapOrElse(fn: () => T) {
    return this.val;
  }
  map<U>(fn: (i: T) => U): Option<U> {
    return new Some(fn(this.val));
  }
  mapOr<U>(d: U, fn: (i: T) => U): U {
    return fn(this.val);
  }
  okOr<E>(err: E): Result<T, E> {
    return new Ok<T, E>(this.val);
  }
  okOrElse<E>(err: () => E): Result<T, E> {
    return new Ok<T, E>(this.val);
  }
  and<U>(d: Option<U>): Option<U> {
    return d;
  }
  andThen<U>(fn: (i: T) => Option<U>): Option<U> {
    return fn(this.val);
  }
  orElse(fn: () => Option<T>): Option<T> {
    return this;
  }
  toString() {
    return "Some " + this.val;
  }
}

export enum ERR_CODE {
  ERR_NONE_NO_MAP = "ERR_NONE_NO_MAP",
  ERR_NONE_NO_UNWRAP = "ERR_NONE_NO_UNWRAP",
  ERR_OK_NO_UNWRAP_ERR = "ERR_OK_NO_UNWRAP_ERR",
  ERR_NO_EXPECT_ERR_OK = "ERR_NO_EXPECT_ERR_OK",
  ERR_NO_ERR_EXPECT = "ERR_NO_ERR_EXPECT"
}

export class None<T> implements Option<T> {
  public static None: Option<any> = new None();
  public static Make<P>(): Option<P> {
    return <Option<P>>None.None;
  }
  constructor() {}
  isSome() {
    return false;
  }
  isNone() {
    return true;
  }
  unwrap(): T {
    throw new Coderr("A None cannot be unwrapped", ERR_CODE.ERR_NONE_NO_UNWRAP);
  }
  unwrapOr(d: T) {
    return d;
  }
  unwrapOrElse(fn: () => T) {
    return fn();
  }
  map<U>(fn: (i: T) => U): Option<U> {
    throw new Coderr("A None cannot be mapped", ERR_CODE.ERR_NONE_NO_MAP);
  }
  mapOr<U>(d: U, fn: (i: T) => U): U {
    return d;
  }
  okOr<E>(err: E): Result<T, E> {
    return new Err<T, E>(err);
  }
  okOrElse<E>(err: () => E): Result<T, E> {
    return new Err<T, E>(err());
  }
  and<U>(d: Option<U>): Option<U> {
    return None.Make<U>();
  }
  andThen<U>(fn: (i: T) => Option<U>): Option<U> {
    return None.Make<U>();
  }
  orElse(fn: () => Option<T>): Option<T> {
    return fn();
  }

  toString() {
    return "None";
  }
}

export interface Result<T, E> {
  isOk(): boolean;
  isErr(): boolean;
  ok(): Option<T>;
  err(): Option<E>;
  map<U>(fn: (x: T) => U): Result<U, E>;
  mapErr<F>(fn: (x: E) => F): Result<T, F>;
  and<U>(res: Result<U, E>): Result<U, E>;
  andThen<U>(op: (x: T) => Result<U, E>): Result<U, E>;
  or(res: Result<T, E>): Result<T, E>;
  orElse<F>(op: (x: E) => Result<T, F>): Result<T, F>;
  unwrapOr(optb: T): T;
  unwrapOrElse(op: (x: E) => T): T;
  unwrap(): T;
  expect(msg: string): T;
  unwrapErr(): E;
  expectErr(msg: string): E;
}

export class Ok<T, E> implements Result<T, E> {
  private val: T;
  constructor(v: T) {
    this.val = v;
  }
  isOk() {
    return true;
  }
  isErr() {
    return false;
  }
  ok(): Option<T> {
    return new Some(this.val);
  }
  err(): Option<E> {
    return None.Make();
  }
  map<U>(fn: (x: T) => U): Result<U, E> {
    return new Ok<U, E>(fn(this.val));
  }
  mapErr<F>(fn: (x: E) => F): Result<T, F> {
    return new Ok<T, F>(this.val);
  }
  and<U>(res: Result<U, E>): Result<U, E> {
    return res;
  }
  andThen<U>(op: (x: T) => Result<U, E>): Result<U, E> {
    return op(this.val);
  }
  or(res: Result<T, E>): Result<T, E> {
    return this;
  }
  orElse<F>(op: (x: E) => Result<T, F>): Result<T, F> {
    return new Ok<T, F>(this.val);
  }
  unwrapOr(optb: T): T {
    return this.val;
  }
  unwrapOrElse(op: (x: E) => T): T {
    return this.val;
  }
  unwrap(): T {
    return this.val;
  }
  expect(msg: string): T {
    return this.val;
  }
  unwrapErr(): E {
    throw new Coderr(
      "Cannot unwrap an Ok " + this.val.toString(),
      ERR_CODE.ERR_OK_NO_UNWRAP_ERR
    );
  }
  expectErr(msg: string): E {
    throw new Coderr(msg + " " + this.val, ERR_CODE.ERR_NO_EXPECT_ERR_OK);
  }
  toString() {
    return "Ok " + this.val;
  }
}

export class Err<T, E> implements Result<T, E> {
  private val: E;
  constructor(v: E) {
    this.val = v;
  }
  isOk() {
    return false;
  }
  isErr() {
    return true;
  }
  ok(): Option<T> {
    return None.Make();
  }
  err(): Option<E> {
    return new Some<E>(this.val);
  }
  map<U>(fn: (x: T) => U): Result<U, E> {
    return new Err<U, E>(this.val);
  }
  mapErr<F>(fn: (x: E) => F): Result<T, F> {
    return new Err(fn(this.val));
  }
  and<U>(res: Result<U, E>): Result<U, E> {
    return new Err(this.val);
  }
  andThen<U>(op: (x: T) => Result<U, E>): Result<U, E> {
    return new Err(this.val);
  }
  or(res: Result<T, E>): Result<T, E> {
    return res;
  }
  orElse<F>(op: (x: E) => Result<T, F>): Result<T, F> {
    return op(this.val);
  }
  unwrapOr(optb: T): T {
    return optb;
  }
  unwrapOrElse(op: (x: E) => T): T {
    return op(this.val);
  }
  unwrap(): T {
    throw this.val;
  }
  expect(msg: string): T {
    if (this.val instanceof Error) {
      // Never mutate the original value
      //https://stackoverflow.com/questions/41474986/how-to-clone-a-javascript-es6-class-instance
      const clone = cloneError(this.val);
      clone.message = msg + " " + this.val.message;
      throw wrap(clone, ERR_CODE.ERR_NO_ERR_EXPECT);
    }
    throw new Coderr(msg + " " + this.val, ERR_CODE.ERR_NO_ERR_EXPECT);
  }
  unwrapErr(): E {
    return this.val;
  }
  expectErr(msg: string): E {
    return this.val;
  }
  toString() {
    return "Err " + this.val;
  }
}

export function cloneError(e: Error): Error {
  return Object.assign(Object.create(Object.getPrototypeOf(e)), e);
}
