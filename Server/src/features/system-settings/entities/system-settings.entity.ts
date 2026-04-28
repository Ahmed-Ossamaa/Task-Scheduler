import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('system_settings')
@Check(`"id" = 1`)
export class SystemSettings {
  @PrimaryColumn({ default: 1 })
  id!: number;

  @Column({ default: 'Schedio' })
  appName!: string;

  @Column({ default: 'support@taskflow.com' })
  contactEmail!: string;

  @Column({ default: '+201554580561' })
  contactPhone!: string;

  @Column({ default: 'Alexandria, Egypt' })
  contactCityAddress!: string;

  @Column({ default: '23 Fawzy Moaz St., Smouha' })
  contactStreetAddress!: string;

  @Column({ type: 'varchar', nullable: true })
  logo!: string | null;

  @Column({ type: 'varchar', nullable: true })
  landingPageImage!: string | null;

  @Column({ type: 'varchar', nullable: true })
  banner!: string | null;

  // social links
  @Column({ type: 'varchar', nullable: true })
  facebookUrl!: string | null;

  @Column({ type: 'varchar', nullable: true })
  twitterUrl!: string | null;

  @Column({ type: 'varchar', nullable: true })
  instagramUrl!: string | null;

  @Column({ type: 'varchar', nullable: true })
  youtubeUrl!: string | null;

  @Column({ type: 'varchar', nullable: true })
  ticktokUrl!: string | null;

  @Column({ type: 'varchar', nullable: true })
  linkedinUrl!: string | null;
  //..

  @Column({ default: false })
  isMaintenanceMode!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
