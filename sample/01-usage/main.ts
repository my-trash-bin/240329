import { Primitive } from "../../src/main";
import { Fake } from "../00-common/Fake";
import { TypeIs } from "../00-common/TypeIs";
import { Article } from "./model/Article";
import { User } from "./model/User";

const User = Fake<User>();

const userPrimitive = User(true);
TypeIs<typeof userPrimitive, Primitive<User>>("same");
const userPrimitiveAll = User({
  select: { id: true, name: true, email: true },
});
TypeIs<typeof userPrimitiveAll, Primitive<User>>("same");
const userEmptyInclude = User({ include: {} });
TypeIs<typeof userEmptyInclude, Primitive<User>>("same");

const userWithIdOnly = User({ select: { id: true } });
TypeIs<typeof userWithIdOnly, Pick<Primitive<User>, "id">>("same");
const userWithArticlesOnly = User({ select: { articles: true } });
TypeIs<typeof userWithArticlesOnly, Record<"articles", Primitive<Article>[]>>(
  "same"
);
const userWithArticles = User({ include: { articles: true } });
TypeIs<
  typeof userWithArticles,
  Primitive<User> & Record<"articles", Primitive<Article>[]>
>("same");

const userNested = User({
  include: {
    articles: true,
    comments: { select: { user: { select: { id: true } } } },
  },
});
TypeIs<
  typeof userNested,
  Primitive<User> & {
    articles: Primitive<Article>[];
    comments: {
      user: { id: number } | null;
    }[];
  }
>("same");
