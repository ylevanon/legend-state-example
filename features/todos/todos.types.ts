import { Tables } from "@/utils/database.types";

export type Todo = Tables<"todos">;

export type TodoCreate = {
  text: string;
  user_id: string;
  done?: boolean;
  counter?: number;
  deleted?: boolean;
};