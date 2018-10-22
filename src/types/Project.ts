import { Field, Int, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

import { User } from "./User";

@ObjectType()
@Entity()
export class Project {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @Column()
  name?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(type => User)
  @ManyToOne(type => User)
  user: User;

  @Column()
  @Field()
  userId: number;
}
