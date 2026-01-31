import { ExternalLink, Search, Trash } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaInstagram, FaTiktok, FaXTwitter } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';
import { MembersPageSkeleton } from '@/components/MembersPageSkeleton';
import { RubyName } from '@/components/RubyName';
import { SocialLinkItem } from '@/components/SocialLinkItem';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { getToday } from '@/lib/utils';
import { useLiveEvents } from '@/providers/LiveEventsProvider';
import type { Member } from '@/types';

export const MembersPage: React.FC = () => {
  const { idols, members, loading } = useLiveEvents();
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.hash, members, idols]);

  const filteredMembers = useMemo(() => {
    const today = getToday();
    return members.filter((member) => !member.leaving_date || member.leaving_date > today);
  }, [members]);

  const handleToggleMember = (memberId: string) => {
    setSelectedMembers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(memberId)) {
        newSet.delete(memberId);
      } else {
        newSet.add(memberId);
      }
      return newSet;
    });
  };

  const handleToggleGroup = (membersInGroup: Member[]) => {
    setSelectedMembers((prev) => {
      const newSet = new Set(prev);
      const memberIdsInGroup = membersInGroup.map((m) => m.id);
      const allSelected = memberIdsInGroup.every((id) => newSet.has(id));

      if (allSelected) {
        memberIdsInGroup.forEach((id) => newSet.delete(id));
      } else {
        memberIdsInGroup.forEach((id) => newSet.add(id));
      }
      return newSet;
    });
  };

  const handleSearchOnTwitter = useCallback(() => {
    const twitterIds = Array.from(selectedMembers)
      .map((id) => filteredMembers.find((m) => m.id === id)?.twitter_id)
      .filter((id): id is string => !!id);

    if (twitterIds.length > 0) {
      const query = twitterIds.map((id) => `from:${id}`).join(' OR ');
      const url = `https://x.com/search?q=${encodeURIComponent(query)}&f=live`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, [selectedMembers, filteredMembers]);

  const handleClear = useCallback(() => {
    setSelectedMembers(new Set());
  }, []);

  const membersByGroup = useMemo(() => {
    const groupMap = new Map<string, Member[]>();
    filteredMembers.forEach((member) => {
      if (!groupMap.has(member.idol_id)) {
        groupMap.set(member.idol_id, []);
      }
      groupMap.get(member.idol_id)?.push(member);
    });
    return idols.map((idol) => ({
      ...idol,
      members: groupMap.get(idol.id) || [],
    }));
  }, [filteredMembers, idols]);

  if (loading) {
    return <MembersPageSkeleton />;
  }

  const idolGroupsWithMembers = membersByGroup.filter((group) => group.members.length > 0);

  return (
    <div className="mx-4 space-y-6">
      <div className="container mx-auto space-y-8">
        {idolGroupsWithMembers.map((group) => {
          const allMembersInGroupSelected =
            group.members.length > 0 && group.members.every((m) => selectedMembers.has(m.id));
          const someMembersInGroupSelected =
            group.members.some((m) => selectedMembers.has(m.id)) && !allMembersInGroupSelected;

          return (
            <section key={group.id} id={group.id} className="scroll-mt-15 pt-4">
              <div className="mb-4 border-b pb-2">
                <label
                  htmlFor={`group-${group.id}`}
                  className="flex cursor-pointer items-center gap-4"
                >
                  <Checkbox
                    id={`group-${group.id}`}
                    checked={
                      allMembersInGroupSelected
                        ? true
                        : someMembersInGroupSelected
                          ? 'indeterminate'
                          : false
                    }
                    onCheckedChange={() => handleToggleGroup(group.members)}
                    aria-label={`${group.name}のメンバーをすべて選択`}
                    className="h-5 w-5"
                  />
                  <h2 className="flex items-center gap-2 text-2xl font-bold">
                    {group.name}
                    <a
                      href={`https://lit.link/${group.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${group.name}のlit.link`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="text-muted-foreground hover:text-foreground h-5 w-5" />
                    </a>
                  </h2>
                </label>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {group.members.map((member) => (
                  <div
                    key={member.id}
                    className="bg-card text-card-foreground flex items-center gap-4 rounded-lg border p-3"
                  >
                    <Checkbox
                      id={`member-${member.id}`}
                      checked={selectedMembers.has(member.id)}
                      onCheckedChange={() => handleToggleMember(member.id)}
                    />
                    <label
                      htmlFor={`member-${member.id}`}
                      style={{
                        backgroundColor: member.color_code,
                        color: member.text_color_code || '#000000',
                      }}
                      className="flex-1 cursor-pointer truncate rounded-lg border p-2 pt-4 font-semibold"
                    >
                      <RubyName name={member.name} ruby={member.name_ruby} />
                    </label>
                    <div className="flex w-48 gap-3">
                      <SocialLinkItem
                        to={member.twitter_id && `https://x.com/${member.twitter_id}`}
                        icon={FaXTwitter}
                        siteName="X.com"
                      />
                      <SocialLinkItem
                        to={
                          member.instagram_id && `https://www.instagram.com/${member.instagram_id}/`
                        }
                        icon={FaInstagram}
                        siteName="Instagram"
                      />
                      <SocialLinkItem
                        to={member.tiktok_id && `https://www.tiktok.com/@${member.tiktok_id}`}
                        icon={FaTiktok}
                        siteName="TikTok"
                      />
                      <SocialLinkItem
                        to={member.litlink_id && `https://lit.link/${member.litlink_id}`}
                        icon={ExternalLink}
                        siteName="lit.link"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {selectedMembers.size > 0 && (
        <div className="sticky bottom-4 z-40 text-center">
          <Button onClick={handleSearchOnTwitter} className="me-2 shadow-lg">
            <Search className="mr-2 h-4 w-4" />
            選択した{selectedMembers.size}人のツイートを検索
          </Button>
          <Button onClick={handleClear} className="shadow-lg">
            <Trash className="mr-2 h-4 w-4" />
            クリア
          </Button>
        </div>
      )}
    </div>
  );
};
