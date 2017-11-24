import test from "ava";
import { Some, None, Ok, Err, ERR_CODE } from "./";

test("Some", t => {
  const regValue = "My Value";
  const reg = new Some(regValue);
  t.true(reg.isSome());
  t.false(reg.isNone());
  t.is(reg.unwrap(), regValue);
  t.is(reg.unwrapOr(""), regValue);
  t.is(reg.unwrapOrElse(() => ""), regValue);
  const mappedSome = reg.map(x => x.toUpperCase());
  t.not(mappedSome, reg);
  t.is(mappedSome.unwrap(), regValue.toUpperCase());
  t.is(reg.mapOr(1, x => 1), 1);
  const annedSomeVal = "Anned Some Str";
  const annedSome = new Some(annedSomeVal);
  t.is(reg.and(annedSome), annedSome);
  t.is(reg.andThen(x => annedSome), annedSome);
  t.is(reg.orElse(() => new Some("f")), reg);
  const okOr = reg.okOr(null);
  t.true(okOr.isOk());
  t.is(okOr.unwrap(), regValue);
  const okOrElse = reg.okOrElse(() => 1);
  t.true(okOrElse.isOk());
  t.is(okOrElse.unwrap(), regValue);
  const andSome = new Some(regValue.toUpperCase());
  const and = reg.and(andSome);
  t.true(and.isSome());
  t.is(and.unwrap(), regValue.toUpperCase());
  const andThen = reg.andThen(s => new Some(s.toUpperCase()));
  t.true(andThen.isSome());
  t.is(andThen.unwrap(), regValue.toUpperCase());
  t.is(reg + "", "Some " + regValue);
});

test("None", t => {
  const myNone = new None();
  t.true(myNone.isNone());
  t.false(myNone.isSome());
  t.throws(
    () => myNone.unwrap(),
    err => {
      if (err.code !== ERR_CODE.ERR_NONE_NO_UNWRAP) return false;
      return true;
    }
  );
  t.is(myNone.unwrapOr(1), 1);
  t.is(myNone.unwrapOrElse(() => 1), 1);
  t.throws(
    () => myNone.map(x => x),
    err => {
      if (err.code !== ERR_CODE.ERR_NONE_NO_MAP) return false;
      return true;
    }
  );
  t.is(myNone.mapOr(1, i => -1), 1);
  const okOr = myNone.okOr(999);
  t.true(okOr.isErr());
  t.is(okOr.unwrapErr(), 999);
  const okOrElse = myNone.okOrElse(() => 999);
  t.true(okOrElse.isErr());
  t.is(okOrElse.unwrapErr(), 999);
  const and = myNone.and(new Some(999));
  t.true(and.isNone());
  const andThen = myNone.andThen(x => new Some(999));
  t.true(andThen.isNone());
  const orElse = myNone.orElse(() => new Some(999));
  t.true(orElse.isSome());
  t.is(orElse.unwrap(), 999);

  t.is(myNone + "", "None");
});

test("Ok", t => {
  const myOkVal = "My Ok Val";
  const myOk = new Ok(myOkVal);
  t.true(myOk.isOk());
  t.false(myOk.isErr());

  const okVal = myOk.ok();
  t.true(okVal.isSome());
  t.is(okVal.unwrap(), myOkVal);

  const errVal = myOk.err();
  t.true(errVal.isNone());

  const map = myOk.map(x => x.toUpperCase());
  t.true(map.isOk());
  t.is(map.unwrap(), myOkVal.toUpperCase());

  const mapErr = myOk.mapErr(x => x);
  t.true(mapErr.isOk());
  t.is(mapErr.unwrap(), myOkVal);

  const and = myOk.and(new Ok(999));
  t.true(and.isOk());
  t.is(and.unwrap(), 999);

  const andThen = myOk.andThen(x => new Ok(x.toLowerCase()));
  t.true(andThen.isOk());
  t.is(andThen.unwrap(), myOkVal.toLowerCase());

  t.is(myOk.or(new Ok("")), myOk);

  const orElse = myOk.orElse(x => new Ok(""));
  t.true(orElse.isOk());
  t.is(orElse.unwrap(), myOkVal);

  t.is(myOk.unwrapOr(""), myOkVal);
  t.is(myOk.unwrapOrElse(x => ""), myOkVal);

  t.is(myOk.unwrap(), myOkVal);
  t.is(myOk.expect(""), myOkVal);
  t.throws(
    () => myOk.unwrapErr(),
    err => {
      if (err.code != ERR_CODE.ERR_OK_NO_UNWRAP_ERR) return false;
      return true;
    }
  );
  t.throws(
    () => myOk.expectErr("my message"),
    err => {
      if (err.code != ERR_CODE.ERR_NO_EXPECT_ERR_OK) return false;
      if (err.message != "my message" + " " + myOkVal) return false;
      return true;
    }
  );

  t.is(myOk + "", "Ok " + myOkVal);
});

test("Err", t => {
  // We are using errors here but really an Err type can contain anything
  const myErrVal = new Error("Inner Error");
  const myErr = new Err(myErrVal);
  t.false(myErr.isOk());
  t.true(myErr.isErr());

  const ok = myErr.ok();
  t.true(ok.isNone());

  const err = myErr.err();
  t.true(err.isSome());
  t.is(err.unwrap(), myErrVal);

  const map = myErr.map(x => x);
  t.is(map.unwrapErr(), myErrVal);

  const otherErr = new Error("other error");
  const mapErr = myErr.mapErr(x => otherErr);
  t.true(mapErr.isErr());
  t.is(mapErr.unwrapErr(), otherErr);

  const and = myErr.and(new Err(otherErr));
  t.is(and.unwrapErr(), myErrVal);

  const andThen = myErr.andThen(x => new Err(otherErr));
  t.is(andThen.unwrapErr(), myErrVal);

  const or = myErr.or(new Ok("Test"));
  t.true(or.isOk());
  t.is(or.unwrap(), "Test");

  const orElse = myErr.orElse(x => new Ok("Hi"));
  t.true(orElse.isOk());
  t.is(orElse.unwrap(), "Hi");

  const unwrapOr = myErr.unwrapOr("hhh");
  t.is(unwrapOr, "hhh");

  const unwrapOrElse = myErr.unwrapOrElse(x => "ggg");
  t.is(unwrapOrElse, "ggg");

  t.throws(() => myErr.unwrap(), err => myErrVal === err);
  t.throws(
    () => myErr.expect("test"),
    err => {
      if (err.code !== ERR_CODE.ERR_NO_ERR_EXPECT) return false;
      if (err.message !== "test " + myErrVal.message) return false;
      return true;
    }
  );
  t.is(myErr.unwrapErr(), myErrVal);
  t.is(myErr.expectErr(""), myErrVal);

  t.is(myErr + "", "Err " + myErrVal);
});
