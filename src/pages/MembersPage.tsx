import { SocialLinkItem } from '@/components/SocialLinkItem';
import { Button } from '@/components/ui/button';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import type { Member } from '@/types';
import { ExternalLink, Search } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaInstagram, FaTiktok, FaXTwitter } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';

import { MembersPageSkeleton } from '@/components/MembersPageSkeleton';

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

  const handleSearchOnTwitter = useCallback(() => {
    const twitterIds = Array.from(selectedMembers)
      .map((name) => members.find((m) => m.name === name)?.twitter_id)
      .filter((id): id is string => !!id);

    if (twitterIds.length > 0) {
      const query = twitterIds.map((id) => `from:${id}`).join(' OR ');
      const url = `https://x.com/search?q=${encodeURIComponent(query)}&f=live`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, [selectedMembers, members]);

  const membersByGroup = useMemo(() => {
    const groupMap = new Map<string, Member[]>();
    members.forEach((member) => {
      if (!groupMap.has(member.idol_id)) {
        groupMap.set(member.idol_id, []);
      }
      groupMap.get(member.idol_id)?.push(member);
    });
    return idols.map((idol) => ({
      ...idol,
      members: groupMap.get(idol.id) || [],
    }));
  }, [members, idols]);

  if (loading) {
    return <MembersPageSkeleton />;
  }

  const idolGroupsWithMembers = membersByGroup.filter((group) => group.members.length > 0);

  return (
    <div className="space-y-6 mx-4">
      <div className="container mx-auto space-y-8">
        {idolGroupsWithMembers.map((group) => (
          <section key={group.id} id={group.id} className="pt-4 scroll-mt-15">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4 flex items-center gap-4">
              {group.name}
              <a
                href={`https://lit.link/${group.id}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${group.name}のlit.link`}
              >
                <ExternalLink className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </a>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.members.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center gap-4 p-3 rounded-lg border bg-card text-card-foreground"
                >
                  <input
                    type="checkbox"
                    id={`member-${member.name}`}
                    checked={selectedMembers.has(member.name)}
                    onChange={() => handleToggleMember(member.name)}
                    className="h-5 w-5 rounded border-primary text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor={`member-${member.name}`}
                    className="flex-1 font-semibold truncate"
                  >
                    {member.name}
                  </label>
                  <div className="flex gap-3">
                    <SocialLinkItem
                      to={member.litlink_id && `https://lit.link/${member.litlink_id}`}
                      icon={ExternalLink}
                      siteName="lit.link"
                    />
                    <SocialLinkItem
                      to={member.twitter_id && `https://x.com/${member.twitter_id}`}
                      icon={FaXTwitter}
                      siteName="X.com"
                    />
                    <SocialLinkItem
                      to={member.tiktok_id && `https://www.tiktok.com/@${member.tiktok_id}`}
                      icon={FaTiktok}
                      siteName="TikTok"
                    />
                    <SocialLinkItem
                      to={
                        member.instagram_id && `https://www.instagram.com/${member.instagram_id}/`
                      }
                      icon={FaInstagram}
                      siteName="Instagram"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {selectedMembers.size > 0 && (
        <div className="sticky bottom-4 z-40 text-center">
          <Button onClick={handleSearchOnTwitter} className="shadow-lg">
            <Search className="mr-2 h-4 w-4" />
            選択した{selectedMembers.size}人のツイートを検索
          </Button>
        </div>
      )}
    </div>
  );
};
