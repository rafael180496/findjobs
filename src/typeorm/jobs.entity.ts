import { Column, Entity } from 'typeorm';

@Entity()
export class Jobs {
  @Column({
    primary: true,
    type: 'text',
    name: 'id_job',
  })
  id: string;

  @Column({
    nullable: false,
    default: '',
    type: 'text',
  })
  title: string;
  @Column({
    nullable: false,
    default: '',
    type: 'text',
  })
  description: string;
  @Column({
    nullable: false,
    default: '',
    type: 'text',
  })
  category: string;

  @Column({
    nullable: false,
    default: '',
    type: 'text',
  })
  linkjob: string;

  @Column({
    nullable: false,
    default: '',
    type: 'text',
  })
  functions: string;

  @Column({
    nullable: false,
    default: 'false',
    type: 'boolean',
  })
  sendjob: boolean;

  @Column('timestamp with time zone', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created: Date;
}
