import { Field, Int, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

import { Project } from "./Project";

@ObjectType()
@Entity()
export class User {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column()
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  address?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(type => String)
  fullName() {
    const fullName = [];
    if (this.firstName) {
      fullName.push(this.firstName);
    }
    if (this.lastName) {
      fullName.push(this.lastName);
    }
    return fullName.join(" ");
  }

  @Field(type => [Project])
  projects: [Project];
}
