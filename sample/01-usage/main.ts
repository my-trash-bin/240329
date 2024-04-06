import { Fake } from "../00-common/Fake";
import { TypeIs } from "../00-common/TypeIs";
import { Article } from "./model/Article";
import { Comment } from "./model/Comment";
import { User } from "./model/User";

const User = Fake<User>();
const Article = Fake<Article>();
const Comment = Fake<Comment>();

const userPrimitive = User(true);
TypeIs<typeof userPrimitive, User["primitive"]>("same");
