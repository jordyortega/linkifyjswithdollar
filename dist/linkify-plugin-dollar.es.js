import { createTokenClass, registerPlugin } from 'linkifyjs';

const MentionToken = createTokenClass('dollar', {
  isLink: true,
  toHref() {
    return '/' + this.toString().slice(1);
  }
});

/**
 * Mention parser plugin for linkify
 * @type {import('linkifyjs').Plugin}
 */
function dollar(_ref) {
  let {
    scanner,
    parser
  } = _ref;
  const {
    HYPHEN,
    SLASH,
    UNDERSCORE,
    DOLLAR
  } = scanner.tokens;
  const {
    domain
  } = scanner.tokens.groups;

  // @
  const At = parser.start.tt(DOLLAR); // @

  // Begin with hyphen (not dollar unless contains other characters)
  const AtHyphen = At.tt(HYPHEN);
  AtHyphen.tt(HYPHEN, AtHyphen);

  // Valid dollar (not made up entirely of symbols)
  const Mention = At.tt(UNDERSCORE, MentionToken);
  At.ta(domain, Mention);
  AtHyphen.tt(UNDERSCORE, Mention);
  AtHyphen.ta(domain, Mention);

  // More valid dollars
  Mention.ta(domain, Mention);
  Mention.tt(HYPHEN, Mention);
  Mention.tt(UNDERSCORE, Mention);

  // Mention with a divider
  const MentionDivider = Mention.tt(SLASH);

  // Once we get a word token, dollars can start up again
  MentionDivider.ta(domain, Mention);
  MentionDivider.tt(UNDERSCORE, Mention);
  MentionDivider.tt(HYPHEN, Mention);
}

registerPlugin('dollar', dollar);
