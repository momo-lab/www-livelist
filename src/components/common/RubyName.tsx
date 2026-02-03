import React from 'react';

interface RubyNameProps {
  name: string;
  ruby: string;
}

export const RubyName: React.FC<RubyNameProps> = ({ name, ruby }) => {
  if (!ruby) {
    return <>{name}</>;
  }

  const nameParts = name.split(' ');
  const rubyParts = ruby.split(' ');

  if (nameParts.length !== rubyParts.length) {
    return <>{name}</>;
  }

  const hiraganaKatakanaRegex = /^[\u3040-\u309F\u30A0-\u30FF]+$/;

  return (
    <>
      {nameParts.map((part, index) => {
        if (hiraganaKatakanaRegex.test(part) || part === rubyParts[index]) {
          return (
            <React.Fragment key={index}>
              {part}
              {index < nameParts.length - 1 && ' '}
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={index}>
            <ruby>
              {part}
              <rt>{rubyParts[index]}</rt>
            </ruby>
            {index < nameParts.length - 1 && ' '}
          </React.Fragment>
        );
      })}
    </>
  );
};
