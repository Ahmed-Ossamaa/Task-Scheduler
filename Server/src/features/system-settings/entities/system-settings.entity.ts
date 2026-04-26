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

  @Column({ default: 'Task Flow' })
  appName?: string;

  @Column({ default: 'support@taskflow.com' })
  contactEmail?: string;

  @Column({ default: '+201554580561' })
  contactPhone?: string;

  @Column({ default: 'Alexandria, Egypt' })
  contactCityAddress?: string;

  @Column({ default: '23 Fawzy Moaz St., Smouha' })
  contactStreetAddress?: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ nullable: true })
  landingPageImage?: string;

  @Column({ nullable: true })
  banner?: string;

  // social links
  @Column({ nullable: true })
  facebookUrl?: string;

  @Column({ nullable: true })
  twitterUrl?: string;

  @Column({ nullable: true })
  instagramUrl?: string;

  @Column({ nullable: true })
  youtubeUrl?: string;

  @Column({ nullable: true })
  ticktokUrl?: string;

  @Column({ nullable: true })
  linkedinUrl?: string;
  //..

  @Column({ default: false })
  isMaintenanceMode!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
