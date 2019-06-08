/* global $, siteRoot */
'use strict'
const MonsterBlockGen = require('./toolbar/monsterblock.gen.js');
const MagicGen = require('./toolbar/magic.gen.js');
const ClassTableGen = require('./toolbar/classtable.gen.js');
const ClassFeatureGen = require('./toolbar/classfeature.gen.js');
const CoverPageGen = require('./toolbar/coverpage.gen.js');
const TableOfContentsGen = require('./toolbar/tableOfContents.gen.js');
let mde

export default {
  name: 'editor',
  props: ['currentPath'],
  data() {
    return {}
  },
  computed: {
    insertContent() {
      return this.$store.state.editor.insertContent
    }
  },
  methods: {
    insert(content) {
      if (mde.codemirror.doc.somethingSelected()) {
        mde.codemirror.execCommand('singleSelection')
      }
      mde.codemirror.doc.replaceSelection(this.insertContent)
    },
    save() {
      let self = this
      this.$http.put(window.location.href, {
        markdown: mde.value()
      }).then(resp => {
        return resp.json()
      }).then(resp => {
        if (resp.ok) {
          window.location.assign(siteRoot + '/' + self.currentPath)
        } else {
          self.$store.dispatch('alert', {
            style: 'red',
            icon: 'ui-2_square-remove-09',
            msg: resp.msg
          })
        }
      }).catch(err => {
        self.$store.dispatch('alert', {
          style: 'red',
          icon: 'ui-2_square-remove-09',
          msg: 'Error: ' + err.body.msg
        })
      })
    }
  },
  mounted() {
    let self = this
    FuseBox.import('/js/simplemde/simplemde.min.js', (SimpleMDE) => {
      mde = new SimpleMDE({
        autofocus: true,
        autoDownloadFontAwesome: true,
        element: this.$refs.editorTextArea,
        placeholder: 'Enter Markdown formatted content here...',
        spellChecker: false,
        status: false,
        toolbar: [
          {
            name: 'bold',
            action: SimpleMDE.toggleBold,
            className: 'icon-bold',
            title: 'Bold'
          },
          {
            name: 'italic',
            action: SimpleMDE.toggleItalic,
            className: 'icon-italic',
            title: 'Italic'
          },
          {
            name: 'strikethrough',
            action: SimpleMDE.toggleStrikethrough,
            className: 'icon-strikethrough',
            title: 'Strikethrough'
          },
          '|',
          {
            name: 'heading-1',
            action: SimpleMDE.toggleHeading1,
            className: 'icon-header fa-header-x fa-header-1',
            title: 'Header (Level 1)'
          },
          {
            name: 'heading-2',
            action: SimpleMDE.toggleHeading2,
            className: 'icon-header fa-header-x fa-header-2',
            title: 'Header (Level 2)'
          },
          {
            name: 'heading-3',
            action: SimpleMDE.toggleHeading3,
            className: 'icon-header fa-header-x fa-header-3',
            title: 'Header (Level 3)'
          },
          {
            name: 'quote',
            action: SimpleMDE.toggleBlockquote,
            className: 'nc-icon-outline text_quote',
            title: 'Quote'
          },
          '|',
          {
            name: 'unordered-list',
            action: SimpleMDE.toggleUnorderedList,
            className: 'nc-icon-outline text_list-bullet',
            title: 'Bullet List'
          },
          {
            name: 'ordered-list',
            action: SimpleMDE.toggleOrderedList,
            className: 'nc-icon-outline text_list-numbers',
            title: 'Numbered List'
          },
          '|',
          {
            name: 'link',
            action: (editor) => {
              window.alert('Coming soon!')
              // todo
            },
            className: 'nc-icon-outline ui-2_link-68',
            title: 'Insert Link'
          },
          {
            name: 'image',
            action: (editor) => {
              self.$store.dispatch('editorFile/open', { mode: 'image' })
            },
            className: 'nc-icon-outline design_image',
            title: 'Insert Image'
          },
          {
            name: 'file',
            action: (editor) => {
              self.$store.dispatch('editorFile/open', { mode: 'file' })
            },
            className: 'nc-icon-outline files_zip-54',
            title: 'Insert File'
          },
          {
            name: 'video',
            action: (editor) => {
              self.$store.dispatch('editorVideo/open')
            },
            className: 'nc-icon-outline media-1_video-64',
            title: 'Insert Video Player'
          },
          '|',
          {
            name: 'inline-code',
            action: (editor) => {
              if (!editor.codemirror.doc.somethingSelected()) {
                return self.$store.dispatch('alert', {
                  style: 'orange',
                  icon: 'design_drag',
                  msg: 'Invalid selection. Select at least 1 character.'
                })
              }
              let curSel = editor.codemirror.doc.getSelections()
              curSel = self._.map(curSel, (s) => {
                return '`' + s + '`'
              })
              editor.codemirror.doc.replaceSelections(curSel)
            },
            className: 'nc-icon-outline arrows-4_enlarge-46',
            title: 'Inline Code'
          },
          {
            name: 'code-block',
            action: (editor) => {
              self.$store.dispatch('editorCodeblock/open', {
                initialContent: (mde.codemirror.doc.somethingSelected()) ? mde.codemirror.doc.getSelection() : ''
              })
            },
            className: 'nc-icon-outline design_code',
            title: 'Code Block'
          },
          '|',
          {
            name: 'table',
            action: (editor) => {
              window.alert('Coming soon!')
              // todo
            },
            className: 'nc-icon-outline ui-2_grid-square',
            title: 'Insert Table'
          },
          {
            name: 'horizontal-rule',
            action: SimpleMDE.drawHorizontalRule,
            className: 'nc-icon-outline design_distribute-vertical',
            title: 'Horizontal Rule'
          },
          '|',
          {
    				name: 'Spell',
            title: 'Spell',
    				className: 'fa fa-magic',
    				action: (editor) => {
              editor.codemirror.replaceSelection(MagicGen.spell())
            }
    			},
    			{
    				name: 'Spell List',
            title: 'Spell List',
    				className: 'fa fa-list',
    				action: (editor) => {
              editor.codemirror.replaceSelection(MagicGen.spellList())
            }
    			},
    			{
    				name : 'Class Feature',
            title: 'Class Feature',
    				className: 'fa fa-trophy',
    				action: (editor) => {
              editor.codemirror.replaceSelection(ClassFeatureGen())
            }
    			},
    			{
    				name: 'Note',
            title: 'Note',
    				className: 'fa fa-sticky-note',
    				action: (editor) => {
    					editor.codemirror.replaceSelection([
    						'> ##### Time to Drop Knowledge',
    						'> Use notes to point out some interesting information. ',
    						'> ',
    						'> **Tables and lists** both work within a note.'
              ].join('\n'))
            }
    			},
    			{
    				name: 'Descriptive Text Box',
            title: 'Descriptive Text Box',
    				className: 'fa fa-sticky-note-o',
    				action: (editor) => {
    					editor.codemirror.replaceSelection([
    						'<div class=\'descriptive\'>',
    						'##### Time to Drop Knowledge',
    						'Use notes to point out some interesting information. ',
    						'',
    						'**Tables and lists** both work within a note.',
    						'</div>'
    					].join('\n'));
            }
    			},
          {
            name: 'monster-stat-block',
            title: 'Monster Stat Block',
            action: (editor) => {
              editor.codemirror.replaceSelection(MonsterBlockGen.half())
              // todo
            },
            className: 'fa fa-bug'
          },
    			{
    				name: 'Wide Monster Stat Block',
            title: 'Full Monster Stat Block',
    				className: 'fa fa-paw',
    				action: (editor) => {
              editor.codemirror.replaceSelection(MonsterBlockGen.full())
            }
    			},
    			{
    				name : 'Cover Page',
            title: 'Cover Page',
    				className: 'fa fa-file-word-o',
    				action: (editor) => {
              editor.codemirror.replaceSelection(CoverPageGen())
            }
    			},
          '|',
          {
            name: 'Class Table',
            title: 'Full Class Table',
            className: 'fa fa-table',
            action: (editor) => {
              editor.codemirror.replaceSelection(ClassTableGen.full())
            }
          },
          {
            name: 'Half Class Table',
            title: 'Half Class Table',
            className: 'fa fa-list-alt',
            action: (editor) => {
              editor.codemirror.replaceSelection(ClassTableGen.half())
            }
          },
          {
            name: 'Table',
            className: 'fa fa-th-list',
            title: 'Table',
            action: (editor) => {
              editor.codemirror.replaceSelection([
                '##### Cookie Tastiness',
                '| Tastiness | Cookie Type |',
                '|:----:|:-------------|',
                '| -5  | Raisin |',
                '| 8th  | Chocolate Chip |',
                '| 11th | 2 or lower |',
                '| 14th | 3 or lower |',
                '| 17th | 4 or lower |\n\n',
              ].join('\n'))
            }
          },
          {
            name: 'Wide Table',
            className: 'fa fa-list',
            title: 'Wide Table',
            action: (editor) => {
              editor.codemirror.replaceSelection([
                '<div class=\'wide\'>',
                '##### Cookie Tastiness',
                '| Tastiness | Cookie Type |',
                '|:----:|:-------------|',
                '| -5  | Raisin |',
                '| 8th  | Chocolate Chip |',
                '| 11th | 2 or lower |',
                '| 14th | 3 or lower |',
                '| 17th | 4 or lower |',
                '</div>\n\n'
              ].join('\n'))
            },
          },
          {
            name: 'Split Table',
            title: 'Split Table',
            className: 'fa-th-large',
            action: (editor) => {
              editor.codemirror.replaceSelection([
                '<div style=\'column-count:2\'>',
                '| d10 | Damage Type |',
                '|:---:|:------------|',
                '|  1  | Acid        |',
                '|  2  | Cold        |',
                '|  3  | Fire        |',
                '|  4  | Force       |',
                '|  5  | Lightning   |',
                '',
                '```',
                '```',
                '',
                '| d10 | Damage Type |',
                '|:---:|:------------|',
                '|  6  | Necrotic    |',
                '|  7  | Poison      |',
                '|  8  | Psychic     |',
                '|  9  | Radiant     |',
                '|  10 | Thunder     |',
                '</div>\n\n',
              ].join('\n'));
            },
          }
        ],
        shortcuts: {
          'toggleBlockquote': null,
          'toggleFullScreen': null,
          'toggleOrderedList': null,
          'toggleCodeBlock': null
        }
      })

      // Save
      $(window).bind('keydown', (ev) => {
        if ((ev.ctrlKey || ev.metaKey) && !(ev.altKey)) {
          switch (String.fromCharCode(ev.which).toLowerCase()) {
            case 's':
              ev.preventDefault()
              self.save()
              break
          }
        }
      })

      // Listeners
      this.$root.$on('editor/save', this.save)
      this.$root.$on('editor/insert', this.insert)

      this.$store.dispatch('pageLoader/complete')
    })
  }
}
