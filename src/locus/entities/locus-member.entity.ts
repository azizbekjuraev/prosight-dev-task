import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { LocusEntity } from './locus.entity';

@Entity({ name: 'rnc_locus_members' })
export class LocusMemberEntity {
  @PrimaryColumn({ name: 'locus_member_id', type: 'int' })
  locusMemberId: number;

  @Column({ name: 'region_id', type: 'int', nullable: true })
  regionId: number | null;

  @Column({ name: 'locus_id', type: 'int' })
  locusId: number;

  @Column({ name: 'membership_status', type: 'varchar', nullable: true })
  membershipStatus: string | null;

  @ManyToOne(() => LocusEntity, (locus) => locus.locusMembers, {
    eager: false,
  })
  @JoinColumn({ name: 'locus_id', referencedColumnName: 'id' })
  locus: LocusEntity;
}
