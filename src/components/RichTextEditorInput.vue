<template>
  <div>
    <div class="menubar">
      <span v-for="actionName in activeButtons" :key="actionName">
        <button
          type="button"
          v-if="actionName === 'bold'"
          class="menubar__button"
          :class="{ 'is-active': editor.isActive('bold') }"
          @click="editor.chain().focus().toggleBold().run()"
        >
          <icon name="bold" />
        </button>
        <button
          type="button"
          v-if="actionName === 'italic'"
          class="menubar__button"
          :class="{ 'is-active': editor.isActive('italic') }"
          @click="editor.chain().focus().toggleItalic().run()"
        >
          <icon name="italic" />
        </button>

        <button
          type="button"
          v-if="actionName === 'strike'"
          class="menubar__button"
          :class="{ 'is-active': editor.isActive('strike') }"
          @click="editor.chain().focus().toggleStrike().run()"
        >
          <icon name="strike" />
        </button>

        <button
          type="button"
          v-if="actionName === 'underline'"
          class="menubar__button"
          :class="{ 'is-active': editor.isActive('underline') }"
          @click="editor.chain().focus().toggleUnderline().run()"
        >
          <icon name="underline" />
        </button>

<!--         <button
          type="button"
          v-if="actionName === 'code'"
          class="menubar__button"
          :class="{ 'is-active': editor.isActive('code') }"
          @click="editor.chain().focus().toggleCode().run()"
        >
          <icon name="code" />
        </button>
 -->
        <button
          type="button"
          v-if="actionName === 'h1'"
          class="menubar__button"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        >
          H1
        </button>

        <button
          type="button"
          v-if="actionName === 'h2'"
          class="menubar__button"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        >
          H2
        </button>

        <button
          type="button"
          v-if="actionName === 'h3'"
          class="menubar__button"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        >
          H3
        </button>

        <button
          type="button"
          v-if="actionName === 'bulletList'"
          class="menubar__button"
          :class="{ 'is-active': editor.isActive('bulletList') }"
          @click="editor.chain().focus().toggleBulletList().run()"
        >
          <icon name="ul" />
        </button>

        <button
          type="button"
          v-if="actionName === 'orderedList'"
          class="menubar__button"
          :class="{ 'is-active': editor.isActive('orderedList') }"
          @click="editor.chain().focus().toggleOrderedList().run()"
        >
          <icon name="ol" />
        </button>

<!--         <button
          type="button"
          v-if="actionName === 'blockquote'"
          class="menubar__button"
          :class="{ 'is-active': editor.isActive('blockquote') }"
          @click="editor.chain().focus().toggleBlockquote().run()"
        >
          <icon name="quote" />
        </button> -->

<!--         <button
          type="button"
          v-if="actionName === 'codeBlock'"
          class="menubar__button"
          :class="{ 'is-active': editor.isActive('codeBlock') }"
          @click="editor.chain().focus().toggleCodeBlock().run()"
        >
          <icon name="code" />
        </button> -->

        <button
          type="button"
          v-if="actionName === 'horizontalRule'"
          class="menubar__button"
          @click="editor.chain().focus().setHorizontalRule().run()"
        >
          <icon name="hr" />
        </button>

        <button
          type="button"
          v-if="actionName === 'undo'"
          class="menubar__button"
          @click="editor.chain().focus().undo().run()"
        >
          <icon name="undo" />
        </button>

        <button
          type="button"
          v-if="actionName === 'redo'"
          class="menubar__button"
          @click="editor.chain().focus().redo().run()"
        >
          <icon name="redo" />
        </button>
      </span>
    </div>

    <div class="mb-5">
      <editor-content :editor="editor"></editor-content>

      <div class="v-input__details" v-for="error in getErrorMessages">
        <div class="v-messages" style="color: rgb(var(--v-theme-error));" role="alert">
          <div class="v-messages__message">{{ error }}</div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import Input from "olobase-admin/src/mixins/input";
import Icon from './Icon.vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

export default {
  mixins: [Input],
  inject: {
    v$: {
      default: null
    }
  },
  components: {
    EditorContent,
    Icon,
  },
  props: {
    /**
     * List of custom error validation messages to show as hint
     */
    errorMessages: {
      type: Array,
      default: () => [],
    },
    minHeight: {
      type: [String, Number],
      default() {
        return 150;
      },
    },
    activeButtons: {
      type: Array,
      validator: function (list) {
        for (let el of list) {
          // The value must match one of these strings
          if (
            [
              'bold',
              'italic',
              'strike',
              'underline',
              'code',
              'h1',
              'h2',
              'h3',
              'bulletList',
              'orderedList',
              'blockquote',
              'codeBlock',
              'horizontalRule',
              'undo',
              'redo',
            ].indexOf(el) === -1
          ) {
            return -1;
          }
        }
        return 1;
      },
      default: () => ['bold', 'italic'],
    },
  },
  // emits: ['update'],
  data() {
    return {
      html: '',
      json: '',
      editor: null,
    };
  },
  created() {
    const Self = this;
    this.editor = new Editor({
      editorProps: {
        attributes: {
          class: 'va-rich-text-editor',
          style: 'min-height: ' + this.minHeight + 'px;',
        },
      },
      content: this.input,
      extensions: [
        StarterKit,
        Underline
      ],
    });
    this.html = this.editor.getHTML();
    this.json = this.editor.getJSON();
    this.editor.on('update', () => {

      const html = this.editor.getHTML();
      if (html == '<p></p>') { // let's reset input if it has dummy value 
        this.input = null
      } else {
        this.input = this.editor.getHTML();  
      }
      Self.update(this.input);
      // this.json = this.editor.getJSON();
      // this.$emit('update', this.html);
    });
  },
  computed: {
    getErrorMessages() {
      if (Array.isArray(this.errorMessages) && this.errorMessages.length > 0) {
        return this.errorMessages;
      }
      return [];
    },
  },
  beforeUnmount() {
    this.editor.destroy();
  },
};
</script>

<style lang="sass" scoped>@import '../src/components/sass/main.scss'</style>
