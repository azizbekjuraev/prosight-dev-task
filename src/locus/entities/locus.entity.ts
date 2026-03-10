import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { LocusMemberEntity } from './locus-member.entity';

@Entity({ name: 'rnc_locus' })
export class LocusEntity {
  @PrimaryColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'assembly_id', type: 'varchar', nullable: true })
  assemblyId: string | null;

  @Column({ name: 'locus_name', type: 'varchar', nullable: true })
  locusName: string | null;

  @Column({ name: 'public_locus_name', type: 'varchar', nullable: true })
  publicLocusName: string | null;

  @Column({ name: 'chromosome', type: 'varchar', nullable: true })
  chromosome: string | null;

  @Column({ name: 'strand', type: 'varchar', nullable: true })
  strand: string | null;

  @Column({ name: 'locus_start', type: 'bigint', nullable: true })
  locusStart: string | null;

  @Column({ name: 'locus_stop', type: 'bigint', nullable: true })
  locusStop: string | null;

  @Column({ name: 'member_count', type: 'int', nullable: true })
  memberCount: number | null;

  @OneToMany(() => LocusMemberEntity, (locusMember) => locusMember.locus)
  locusMembers: LocusMemberEntity[];
}
