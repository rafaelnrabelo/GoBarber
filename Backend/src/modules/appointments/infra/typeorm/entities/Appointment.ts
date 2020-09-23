import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import User from "@modules/users/infra/typeorm/entities/User";

@Entity("appointments")
class Appointment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  provider_id: string;

  @ManyToOne(() => User, { onDelete: "SET NULL", onUpdate: "CASCADE" })
  @JoinColumn({ name: "provider_id" })
  provider: User;

  @Column("timestamp with time zone")
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Appointment;
